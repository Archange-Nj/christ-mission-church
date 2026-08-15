import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { WorshipServiceTime } from '../../types';

const emptyForm = { label: '', day: '', time: '', location: '', sort_order: 0 };

export default function AdminWorshipTimes() {
  const [items, setItems] = useState<WorshipServiceTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<WorshipServiceTime | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function loadItems() {
    setIsLoading(true);
    const { data } = await supabase
      .from('worship_service_times')
      .select('*')
      .order('sort_order', { ascending: true });
    setItems((data as WorshipServiceTime[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet horaire ?')) return;
    await supabase.from('worship_service_times').delete().eq('id', id);
    loadItems();
  }

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Nous rejoindre</p>
          <h1 className="section-title mt-1">Horaires de culte</h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-gold !px-4 !py-2 text-xs">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">Aucun horaire pour le moment.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card-panel flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-paper">{item.label}</p>
                <p className="text-xs text-mist">
                  {item.day} · {item.time} · {item.location}
                </p>
              </div>
              <button
                onClick={() => setEditing(item)}
                className="rounded-lg p-2 text-mist hover:bg-white/5 hover:text-gold"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-2 text-mist hover:bg-white/5 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editing) && (
        <WorshipTimeForm
          item={editing}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditing(null);
            loadItems();
          }}
        />
      )}
    </div>
  );
}

function WorshipTimeForm({
  item,
  onClose,
  onSaved,
}: {
  item: WorshipServiceTime | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(
    item
      ? {
          label: item.label,
          day: item.day,
          time: item.time,
          location: item.location,
          sort_order: 0,
        }
      : emptyForm
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const { error } = item
      ? await supabase
          .from('worship_service_times')
          .update(form)
          .eq('id', item.id)
      : await supabase.from('worship_service_times').insert(form);

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
        className="card-panel w-full max-w-md bg-charcoal-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-paper">
            {item ? "Modifier l'horaire" : 'Nouvel horaire'}
          </p>
          <button onClick={onClose} className="text-mist hover:text-paper">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-mist">
              Libellé (ex. Culte principal)
            </label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="input mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-mist">Jour</label>
              <input
                required
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-mist">Heure</label>
              <input
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-mist">Lieu</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input mt-1"
            />
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
