import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockEvents } from '../data/mockData';
import type { ChurchEvent, ChurchEventCategory, EventRegistration } from '../types';

const categoryLabels: Record<ChurchEventCategory, string> = {
  culte: 'Culte',
  priere: 'Prière',
  jeunesse: 'Jeunesse',
  communaute: 'Communauté',
  special: 'Spécial',
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Events() {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<ChurchEvent[]>(mockEvents);
  const [category, setCategory] = useState<ChurchEventCategory | 'tous'>(
    (searchParams.get('categorie') as ChurchEventCategory) || 'tous'
  );
  const [registeringFor, setRegisteringFor] = useState<ChurchEvent | null>(null);

  useEffect(() => {
    async function loadEvents() {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('starts_at', { ascending: true });
      if (!error && data && data.length > 0) {
        setEvents(data as ChurchEvent[]);
      }
    }
    loadEvents();
  }, []);

  const filtered = useMemo(
    () =>
      [...events]
        .filter((e) => category === 'tous' || e.category === category)
        .sort(
          (a, b) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        ),
    [events, category]
  );

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <Reveal>
          <p className="eyebrow">Vie d'église</p>
          <h1 className="section-title mt-2">Événements</h1>
          <p className="mt-3 max-w-xl text-sm text-mist">
            Retrouvez les prochains rendez-vous de notre communauté et
            inscrivez-vous en quelques secondes.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex flex-wrap gap-2">
            {(['tous', ...Object.keys(categoryLabels)] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c as ChurchEventCategory | 'tous')}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-white/15 text-mist hover:border-white/30 hover:text-paper'
                }`}
              >
                {c === 'tous' ? 'Tous' : categoryLabels[c as ChurchEventCategory]}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist">
            Aucun événement dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="space-y-5">
            {filtered.map((event, i) => {
              const date = new Date(event.starts_at);
              const full =
                event.capacity !== null &&
                event.spots_taken !== null &&
                event.spots_taken >= event.capacity;

              return (
                <Reveal key={event.id} delay={i * 80}>
                  <div className="card-panel flex flex-col gap-5 p-5 sm:flex-row">
                    <div className="flex shrink-0 flex-row gap-4 sm:flex-col sm:items-center sm:text-center">
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-gold/10 text-gold sm:h-20 sm:w-20">
                        <span className="text-xl font-bold leading-none sm:text-2xl">
                          {date.toLocaleDateString('fr-FR', { day: '2-digit' })}
                        </span>
                        <span className="text-[0.65rem] font-semibold uppercase">
                          {date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}
                        </span>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-mist">
                        {categoryLabels[event.category]}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-display text-xl font-semibold text-paper">
                        {event.title}
                      </p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mist">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} /> {formatDateTime(event.starts_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} /> {event.location}
                        </span>
                        {event.capacity !== null && (
                          <span className="flex items-center gap-1.5">
                            <Users size={13} />
                            {event.spots_taken}/{event.capacity} inscrits
                          </span>
                        )}
                      </p>
                      <p className="mt-3 text-sm text-mist">{event.description}</p>

                      {event.registration_required && (
                        <button
                          onClick={() => setRegisteringFor(event)}
                          disabled={full}
                          className="btn-gold mt-4 !px-5 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {full ? 'Complet' : "S'inscrire"}
                        </button>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {registeringFor && (
        <RegistrationModal
          event={registeringFor}
          onClose={() => setRegisteringFor(null)}
        />
      )}
    </div>
  );
}

function RegistrationModal({
  event,
  onClose,
}: {
  event: ChurchEvent;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    guests: 1,
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    const payload: EventRegistration = { ...form, event_id: event.id };

    if (!isSupabaseConfigured) {
      // Demo mode: simulate success without a backend.
      setTimeout(() => setStatus('success'), 500);
      return;
    }

    const { error } = await supabase.from('event_registrations').insert(payload);
    setStatus(error ? 'error' : 'success');
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="card-panel w-full max-w-md bg-charcoal-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gold">
              Inscription
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-paper">
              {event.title}
            </p>
          </div>
          <button onClick={onClose} className="text-mist hover:text-paper">
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 size={40} className="text-gold" />
            <p className="text-sm text-paper">
              Merci {form.full_name.split(' ')[0] || ''} ! Votre inscription a
              bien été enregistrée.
            </p>
            <button onClick={onClose} className="btn-outline mt-2">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-mist">Nom complet</label>
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-mist">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-mist">Téléphone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-mist">
                Nombre de personnes
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.guests}
                onChange={(e) =>
                  setForm({ ...form, guests: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-mist">
                Message (optionnel)
              </label>
              <textarea
                rows={2}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-400">
                Une erreur est survenue. Merci de réessayer.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-gold w-full"
            >
              {status === 'submitting' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Confirmer l'inscription"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
