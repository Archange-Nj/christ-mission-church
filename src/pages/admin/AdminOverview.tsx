import { useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  HandCoins,
  Mail,
  MessageCircleHeart,
  Users,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Counts {
  sermons: number;
  events: number;
  registrations: number;
  prayerRequests: number;
  donations: number;
  messages: number;
}

const cards = [
  { key: 'sermons', label: 'Sermons', icon: BookOpen },
  { key: 'events', label: 'Événements', icon: CalendarDays },
  { key: 'registrations', label: 'Inscriptions', icon: Users },
  { key: 'prayerRequests', label: 'Demandes de prière', icon: MessageCircleHeart },
  { key: 'donations', label: 'Dons', icon: HandCoins },
  { key: 'messages', label: 'Messages', icon: Mail },
] as const;

export default function AdminOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function loadCounts() {
      const [sermons, events, registrations, prayerRequests, donations, messages] =
        await Promise.all([
          supabase.from('sermons').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('prayer_requests')
            .select('*', { count: 'exact', head: true }),
          supabase.from('donations').select('*', { count: 'exact', head: true }),
          supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true }),
        ]);

      setCounts({
        sermons: sermons.count ?? 0,
        events: events.count ?? 0,
        registrations: registrations.count ?? 0,
        prayerRequests: prayerRequests.count ?? 0,
        donations: donations.count ?? 0,
        messages: messages.count ?? 0,
      });
    }
    loadCounts();
  }, []);

  return (
    <div className="pb-16 lg:pb-0">
      <p className="eyebrow">Tableau de bord</p>
      <h1 className="section-title mt-1">Aperçu</h1>
      <p className="mt-2 text-sm text-mist">
        Bienvenue dans l'espace d'administration du site.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map(({ key, label, icon: Icon }) => (
          <div key={key} className="card-panel p-5">
            <Icon size={20} className="text-gold" />
            <p className="mt-3 text-2xl font-semibold text-paper">
              {counts ? counts[key] : '—'}
            </p>
            <p className="text-xs text-mist">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
