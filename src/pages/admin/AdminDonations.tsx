import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SearchBar from '../../components/admin/SearchBar';
import type { Donation, DonationFund, DonationMethod } from '../../types';

interface DonationRow extends Donation {
  id: string;
  created_at: string;
}

const fundLabels: Record<DonationFund, string> = {
  general: 'Fonds général',
  missions: 'Missions',
  construction: 'Construction',
  jeunesse: 'Jeunesse',
  benevolence: 'Bienfaisance',
};

const methodLabels: Record<DonationMethod, string> = {
  card: 'Carte bancaire',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Virement',
};

export default function AdminDonations() {
  const [items, setItems] = useState<DonationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        `${i.full_name} ${i.email} ${fundLabels[i.fund]} ${methodLabels[i.method]}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [items, query]
  );

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      setItems((data as DonationRow[]) ?? []);
      setIsLoading(false);
    }
    load();
  }, []);

  const total = items.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="pb-16 lg:pb-0">
      <p className="eyebrow">Générosité</p>
      <h1 className="section-title mt-1">Dons</h1>

      {!isLoading && items.length > 0 && (
        <div className="card-panel mt-6 inline-block px-5 py-3">
          <p className="text-xs text-mist">Total enregistré</p>
          <p className="mt-0.5 font-display text-xl font-semibold text-gold">
            {total.toLocaleString('fr-FR')} XAF
          </p>
        </div>
      )}

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un don..."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">Aucun don enregistré.</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-mist">
          Aucun résultat pour cette recherche.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-mist">
                <th className="pb-3 pr-4 font-medium">Donateur</th>
                <th className="pb-3 pr-4 font-medium">Montant</th>
                <th className="pb-3 pr-4 font-medium">Destination</th>
                <th className="pb-3 pr-4 font-medium">Méthode</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <p className="text-paper">{item.full_name}</p>
                    <p className="text-xs text-mist">{item.email}</p>
                  </td>
                  <td className="py-3 pr-4 font-medium text-gold">
                    {Number(item.amount).toLocaleString('fr-FR')} {item.currency}
                    {item.is_recurring && (
                      <span className="ml-1.5 rounded-full bg-white/5 px-1.5 py-0.5 text-[0.6rem] text-mist">
                        récurrent
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-mist">{fundLabels[item.fund]}</td>
                  <td className="py-3 pr-4 text-mist">{methodLabels[item.method]}</td>
                  <td className="py-3 text-mist">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}