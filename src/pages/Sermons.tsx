import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlayCircle, Search } from 'lucide-react';
import Reveal from '../components/Reveal';
import VideoModal from '../components/VideoModal';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockSermons } from '../data/mockData';
import type { Sermon } from '../types';

export default function Sermons() {
  const [searchParams] = useSearchParams();
  const [sermons, setSermons] = useState<Sermon[]>(mockSermons);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [theme, setTheme] = useState<string>('Tous');
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    async function loadSermons() {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setSermons(data as Sermon[]);
      }
    }
    loadSermons();
  }, []);

  const themes = useMemo(
    () => ['Tous', ...Array.from(new Set(sermons.map((s) => s.theme)))],
    [sermons]
  );

  const filtered = useMemo(
    () =>
      sermons.filter((s) => {
        const matchesTheme = theme === 'Tous' || s.theme === theme;
        const matchesQuery =
          !query.trim() ||
          `${s.title} ${s.speaker} ${s.description}`
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        return matchesTheme && matchesQuery;
      }),
    [sermons, theme, query]
  );

  return (
    <div className="pt-32">
      <section id="direct" className="mx-auto max-w-7xl px-6 pb-10">
        <Reveal>
          <p className="eyebrow">Médias</p>
          <h1 className="section-title mt-2">Sermons</h1>
          <p className="mt-3 max-w-xl text-sm text-mist">
            Retrouvez nos prédications récentes, filtrez-les par thème ou
            recherchez un message en particulier.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    theme === t
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-white/15 text-mist hover:border-white/30 hover:text-paper'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 focus-within:border-gold sm:w-auto">
              <Search size={15} className="text-mist" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un sermon..."
                className="w-full bg-transparent text-sm text-paper placeholder:text-mist focus:outline-none"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist">
            Aucun sermon ne correspond à votre recherche.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sermon, i) => (
              <Reveal key={sermon.id} delay={(i % 3) * 100}>
                <button
                  onClick={() => setActiveSermon(sermon)}
                  className="card-panel group block w-full overflow-hidden text-left transition-colors hover:border-gold/40"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={sermon.thumbnail_url}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <PlayCircle size={40} className="text-gold" />
                    </div>
                    {sermon.duration_minutes && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[0.65rem] font-medium text-paper">
                        {sermon.duration_minutes} min
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-gold">
                      {sermon.theme}
                    </span>
                    <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-paper">
                      {sermon.title}
                    </p>
                    <p className="mt-1 text-xs text-mist">
                      {sermon.speaker} ·{' '}
                      {new Date(sermon.published_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm text-mist">
                      {sermon.description}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {activeSermon && (
        <VideoModal
          youtubeUrl={activeSermon.youtube_url}
          title={activeSermon.title}
          onClose={() => setActiveSermon(null)}
        />
      )}
    </div>
  );
}
