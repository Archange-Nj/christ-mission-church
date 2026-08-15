import { useEffect, useState } from 'react';
import { Loader2, Lock, Mail, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { PrayerRequest, PrayerRequestCategory } from '../../types';

interface PrayerRequestRow extends PrayerRequest {
  id: string;
  created_at: string;
}

const categoryLabels: Record<PrayerRequestCategory, string> = {
  sante: 'Santé',
  famille: 'Famille',
  travail: 'Travail',
  spirituel: 'Vie spirituelle',
  deuil: 'Deuil',
  autre: 'Autre',
};

export default function AdminPrayerRequests() {
  const [items, setItems] = useState<PrayerRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setItems((data as PrayerRequestRow[]) ?? []);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="pb-16 lg:pb-0">
      <p className="eyebrow flex items-center gap-1.5">
        <Lock size={12} /> Confidentiel
      </p>
      <h1 className="section-title mt-1">Demandes de prière</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">Aucune demande pour le moment.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-paper">{item.full_name}</p>
                <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs text-gold">
                  {categoryLabels[item.category]}
                </span>
              </div>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist">
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {item.email}
                </span>
                {item.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {item.phone}
                  </span>
                )}
                <span>
                  {new Date(item.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <p className="mt-3 text-sm text-mist">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
