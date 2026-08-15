import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Sermon } from '../../types';

const emptyForm = {
  title: '',
  speaker: '',
  series: '',
  theme: '',
  description: '',
  youtube_url: '',
  thumbnail_url: '',
  published_at: new Date().toISOString().slice(0, 10),
  duration_minutes: 30,
};

export default function AdminSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function loadSermons() {
    setIsLoading(true);
    const { data } = await supabase
      .from('sermons')
      .select('*')
      .order('published_at', { ascending: false });
    setSermons((data as Sermon[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadSermons();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce sermon ?')) return;
    await supabase.from('sermons').delete().eq('id', id);
    loadSermons();
  }

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Médias</p>
          <h1 className="section-title mt-1">Sermons</h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-gold !px-4 !py-2 text-xs">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : sermons.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">
          Aucun sermon pour le moment.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {sermons.map((sermon) => (
            <div
              key={sermon.id}
              className="card-panel flex items-center gap-4 p-4"
            >
              <img
                src={sermon.thumbnail_url}
                alt=""
                className="h-14 w-20 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-paper">
                  {sermon.title}
                </p>
                <p className="text-xs text-mist">
                  {sermon.speaker} · {sermon.theme} ·{' '}
                  {new Date(sermon.published_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => setEditing(sermon)}
                className="rounded-lg p-2 text-mist hover:bg-white/5 hover:text-gold"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(sermon.id)}
                className="rounded-lg p-2 text-mist hover:bg-white/5 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editing) && (
        <SermonForm
          sermon={editing}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditing(null);
            loadSermons();
          }}
        />
      )}
    </div>
  );
}

function SermonForm({
  sermon,
  onClose,
  onSaved,
}: {
  sermon: Sermon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(
    sermon
      ? {
          title: sermon.title,
          speaker: sermon.speaker,
          series: sermon.series ?? '',
          theme: sermon.theme,
          description: sermon.description,
          youtube_url: sermon.youtube_url,
          thumbnail_url: sermon.thumbnail_url,
          published_at: sermon.published_at.slice(0, 10),
          duration_minutes: sermon.duration_minutes ?? 30,
        }
      : emptyForm
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = { ...form, series: form.series || null };

    const { error } = sermon
      ? await supabase.from('sermons').update(payload).eq('id', sermon.id)
      : await supabase.from('sermons').insert(payload);

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
            {sermon ? 'Modifier le sermon' : 'Nouveau sermon'}
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prédicateur">
              <input
                required
                value={form.speaker}
                onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Thème">
              <input
                required
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
                className="input"
              />
            </Field>
          </div>

          <Field label="Série (optionnel)">
            <input
              value={form.series}
              onChange={(e) => setForm({ ...form, series: e.target.value })}
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

          <Field label="URL YouTube">
            <input
              required
              type="url"
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="URL de la miniature">
            <input
              required
              type="url"
              value={form.thumbnail_url}
              onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date de publication">
              <input
                required
                type="date"
                value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Durée (min)">
              <input
                type="number"
                min={1}
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: Number(e.target.value) })
                }
                className="input"
              />
            </Field>
          </div>

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
