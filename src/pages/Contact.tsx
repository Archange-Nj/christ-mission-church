import { useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircleHeart,
  Phone,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type {
  ContactMessage,
  PrayerRequest,
  PrayerRequestCategory,
} from '../types';

const prayerCategories: { value: PrayerRequestCategory; label: string }[] = [
  { value: 'sante', label: 'Santé' },
  { value: 'famille', label: 'Famille' },
  { value: 'travail', label: 'Travail' },
  { value: 'spirituel', label: 'Vie spirituelle' },
  { value: 'deuil', label: 'Deuil' },
  { value: 'autre', label: 'Autre' },
];

export default function Contact() {
  const [tab, setTab] = useState<'priere' | 'contact'>('priere');

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-4xl px-6 pb-12 text-center">
        <Reveal>
          <p className="eyebrow">Nous sommes là pour vous</p>
          <h1 className="section-title mt-2">Contact &amp; demande de prière</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mist">
            Que vous ayez besoin de prière ou souhaitiez simplement nous
            écrire, notre équipe pastorale vous répondra avec attention.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-24 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <div className="space-y-6">
            <div className="card-panel p-6">
              <p className="eyebrow">Coordonnées</p>
              <ul className="mt-4 space-y-4 text-sm text-mist">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                  Avenue de la Réconciliation, Douala, Cameroun
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-gold" />
                  +237 6 00 00 00 00
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-gold" />
                  contact@christmissionchurch.org
                </li>
              </ul>
            </div>
            <div className="card-panel h-56 overflow-hidden">
              <iframe
                title="Localisation de Christ Mission Church"
                className="h-full w-full grayscale invert-[0.92]"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.68%2C4.03%2C9.78%2C4.09&layer=mapnik"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="card-panel p-6 sm:p-8">
            <div className="mb-6 flex gap-2 rounded-full bg-white/5 p-1">
              <button
                onClick={() => setTab('priere')}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
                  tab === 'priere'
                    ? 'bg-gold text-charcoal'
                    : 'text-mist hover:text-paper'
                }`}
              >
                Demande de prière
              </button>
              <button
                onClick={() => setTab('contact')}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
                  tab === 'contact'
                    ? 'bg-gold text-charcoal'
                    : 'text-mist hover:text-paper'
                }`}
              >
                Message général
              </button>
            </div>

            {tab === 'priere' ? <PrayerForm /> : <ContactForm />}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function PrayerForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    category: 'spirituel' as PrayerRequestCategory,
    message: '',
    is_confidential: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    const payload: PrayerRequest = { ...form };

    if (!isSupabaseConfigured) {
      setTimeout(() => setStatus('success'), 500);
      return;
    }

    const { error } = await supabase.from('prayer_requests').insert(payload);
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <CheckCircle2 size={40} className="text-gold" />
        <p className="font-display text-lg font-semibold text-paper">
          Votre demande a été reçue
        </p>
        <p className="max-w-sm text-sm text-mist">
          Notre équipe de prière portera votre requête devant Dieu dans les
          prochains jours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-gold/25 bg-gold/5 px-3 py-2 text-xs text-gold">
        <Lock size={14} className="shrink-0" />
        Votre demande reste confidentielle et n'est lue que par l'équipe
        pastorale.
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-mist">Nom complet</label>
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>
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
      </div>

      <div>
        <label className="text-xs font-medium text-mist">Téléphone (optionnel)</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-mist">Catégorie</label>
        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as PrayerRequestCategory })
          }
          className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
        >
          {prayerCategories.map((c) => (
            <option key={c.value} value={c.value} className="bg-charcoal">
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-mist">Votre demande</label>
        <textarea
          required
          rows={4}
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
          <>
            <MessageCircleHeart size={16} /> Envoyer ma demande
          </>
        )}
      </button>
    </form>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    const payload: ContactMessage = { ...form };

    if (!isSupabaseConfigured) {
      setTimeout(() => setStatus('success'), 500);
      return;
    }

    const { error } = await supabase.from('contact_messages').insert(payload);
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <CheckCircle2 size={40} className="text-gold" />
        <p className="font-display text-lg font-semibold text-paper">
          Message envoyé
        </p>
        <p className="max-w-sm text-sm text-mist">
          Merci de nous avoir écrit, nous reviendrons vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-mist">Nom complet</label>
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>
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
      </div>

      <div>
        <label className="text-xs font-medium text-mist">Sujet</label>
        <input
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-mist">Message</label>
        <textarea
          required
          rows={4}
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
          <>
            <Mail size={16} /> Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
