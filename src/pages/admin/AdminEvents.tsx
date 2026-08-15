import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, Users, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ChurchEvent, ChurchEventCategory } from '../../types';

const categoryLabels: Record<ChurchEventCategory, string> = {
  culte: 'Culte',
  priere: 'Prière',
  jeunesse: 'Jeunesse',
  communaute: 'Communauté',
  special: 'Spécial',
};

const emptyForm = {
  title: '',
  description: '',
  location: '',
  category: 'communaute' as ChurchEventCategory,
  starts_at: '',
  ends_at: '',
  image_url: '',
  registration_required: false,
  capacity: '' as number | '',
};

export default function AdminEvents() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<ChurchEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function loadEvents() {
    setIsLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('starts_at', { ascending: true });
    setEvents((data as ChurchEvent[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet événement et ses inscriptions ?')) return;
    await supabase.from('events').delete().eq('id', id);
    loadEvents();
  }

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Vie d'église</p>
          <h1 className="section-title mt-1">Événements</h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-gold !px-4 !py-2 text-xs">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : events.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">
          Aucun événement pour le moment.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {events.map((event) => (
            <div key={event.id} className="card-panel flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-paper">
                  {event.title}
                </p>
                <p className="text-xs text-mist">
                  {categoryLabels[event.category]} ·{' '}
                  {new Date(event.starts_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · {event.location}
                </p>
              </div>
              {event.registration_required && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-mist">
                  <Users size={12} />
                  {event.spots_taken ?? 0}
                  {event.capacity ? `/${event.capacity}` : ''}
                </span>
              )}
              <button
                onClick={() => setEditing(event)}
                className="rounded-lg p-2 text-mist hover:bg-white/5 hover:text-gold"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="rounded-lg p-2 text-mist hover:bg-white/5 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editing) && (
        <EventForm
          event={editing}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditing(null);
            loadEvents();
          }}
        />
      )}
    </div>
  );
}

function toLocalInputValue(iso: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function EventForm({
  event,
  onClose,
  onSaved,
}: {
  event: ChurchEvent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(
    event
      ? {
          title: event.title,
          description: event.description,
          location: event.location,
          category: event.category,
          starts_at: toLocalInputValue(event.starts_at),
          ends_at: toLocalInputValue(event.ends_at),
          image_url: event.image_url ?? '',
          registration_required: event.registration_required,
          capacity: event.capacity ?? ('' as number | ''),
        }
      : emptyForm
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      category: form.category,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      image_url: form.image_url || null,
      registration_required: form.registration_required,
      capacity: form.capacity === '' ? null : Number(form.capacity),
    };

    const { error } = event
      ? await supabase.from('events').update(payload).eq('id', event.id)
      : await supabase.from('events').insert(payload);

    setIsSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-panel max-h-[90vh] w-full max-w-lg overflow-y-auto bg-charcoal-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-paper">
            {event ? "Modifier l'événement" : 'Nouvel événement'}
          </p>
          <button onClick={onClose} className="text-mist hover:text-paper">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Titre">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Description">
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Lieu">
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Catégorie">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ChurchEventCategory })
                }
                className="input"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-charcoal">
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Début">
              <input
                required
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Fin (optionnel)">
              <input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                className="input"
              />
            </Field>
          </div>

          <Field label="URL de l'image (optionnel)">
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="input"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-mist">
            <input
              type="checkbox"
              checked={form.registration_required}
              onChange={(e) =>
                setForm({ ...form, registration_required: e.target.checked })
              }
              className="h-4 w-4 rounded border-white/30 bg-white/5 accent-[#D4AF37]"
            />
            Inscription requise
          </label>

          {form.registration_required && (
            <Field label="Capacité (optionnel)">
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    capacity: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="input"
              />
            </Field>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button type="submit" disabled={isSaving} className="btn-gold w-full">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-mist">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
