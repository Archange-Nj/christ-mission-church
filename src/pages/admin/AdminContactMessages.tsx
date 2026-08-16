import { useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SearchBar from '../../components/admin/SearchBar';
import type { ContactMessage } from '../../types';

interface ContactMessageRow extends ContactMessage {
  id: string;
  created_at: string;
}

export default function AdminContactMessages() {
  const [items, setItems] = useState<ContactMessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        `${i.full_name} ${i.email} ${i.subject} ${i.message}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [items, query]
  );

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setItems((data as ContactMessageRow[]) ?? []);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="pb-16 lg:pb-0">
      <p className="eyebrow">Boîte de réception</p>
      <h1 className="section-title mt-1">Messages</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un message..."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">Aucun message pour le moment.</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">
          Aucun résultat pour cette recherche.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="card-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-paper">{item.subject}</p>
                <span className="text-xs text-mist">
                  {new Date(item.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist">
                <span>{item.full_name}</span>
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {item.email}
                </span>
                {item.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {item.phone}
                  </span>
                )}
              </p>
              <p className="mt-3 text-sm text-mist">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}