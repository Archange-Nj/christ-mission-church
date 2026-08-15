import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Church,
  Clock,
  HandHeart,
  MapPin,
  PlayCircle,
  Search,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import VideoModal from '../components/VideoModal';
import {
  mockEvents,
  mockSermons,
  serviceGroups,
  worshipServiceTimes,
} from '../data/mockData';

const shortcuts = [
  {
    label: 'Watch',
    sublabel: 'Médias',
    icon: PlayCircle,
    href: '/sermons',
  },
  {
    label: 'Give',
    sublabel: 'Dons',
    icon: HandHeart,
    href: '/dons',
  },
  {
    label: 'Who We Are',
    sublabel: 'À propos',
    icon: Church,
    href: '/a-propos',
  },
  {
    label: 'Events',
    sublabel: 'Événements',
    icon: CalendarDays,
    href: '/evenements',
  },
];

function formatEventDate(iso: string) {
  const date = new Date(iso);
  return {
    day: date.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
  };
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeSermon, setActiveSermon] = useState<
    (typeof mockSermons)[number] | null
  >(null);
  const navigate = useNavigate();

  const upcomingEvents = useMemo(
    () =>
      [...mockEvents]
        .sort(
          (a, b) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        )
        .slice(0, 3),
    []
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/sermons?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-charcoal">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-charcoal" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center">
          <Reveal>
            <p className="eyebrow mb-4">Christ Mission Church</p>
            <h1 className="font-display text-4xl font-semibold text-balance text-paper sm:text-6xl">
              Bienvenue à notre communauté
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base text-mist sm:text-lg">
              Une famille unie par la foi en Jésus-Christ, ouverte à tous ceux
              qui cherchent l'espérance, la vérité et l'amour de Dieu.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 backdrop-blur-sm focus-within:border-gold"
            >
              <Search size={18} className="ml-3 shrink-0 text-mist" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Que puis-je vous aider à trouver ?"
                className="w-full bg-transparent py-2.5 text-sm text-paper placeholder:text-mist focus:outline-none"
              />
              <button type="submit" className="btn-gold !px-5 !py-2.5 text-xs">
                Rechercher
              </button>
            </form>
          </Reveal>

          <Reveal delay={300}>
            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {shortcuts.map(({ label, sublabel, icon: Icon, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="card-panel group flex flex-col items-center gap-2 px-3 py-6 transition-all duration-300 hover:border-gold/50 hover:-translate-y-1"
                >
                  <Icon
                    size={26}
                    className="text-gold transition-transform group-hover:scale-110"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wide text-paper">
                    {sublabel}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Welcome message */}
      <section className="bg-charcoal-soft px-6 py-20">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center text-balance font-display text-2xl leading-relaxed text-paper/90 sm:text-3xl">
            « Christ Mission Church est une famille de croyants unis par la
            foi en Jésus-Christ, appelés à vivre son Évangile au quotidien.
            Nous vous invitons à nous rejoindre ce dimanche et à cheminer
            avec nous. »
          </p>
          <p className="mt-6 text-center text-sm font-medium uppercase tracking-wide text-gold">
            Pasteur Samuel Eto &amp; l'équipe pastorale
          </p>
        </Reveal>
      </section>

      {/* Ministry / group cards */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {serviceGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 100}>
              <Link
                to={group.href}
                className="group relative block h-64 overflow-hidden rounded-2xl"
              >
                <img
                  src={group.image_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xl font-semibold text-paper">
                    {group.title}
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {group.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Events + blog */}
      <section className="bg-charcoal-soft px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="eyebrow text-center">Quoi de neuf</p>
            <h2 className="section-title mt-2 text-center">
              Événements &amp; actualités
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-3" delay={100}>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-paper">
                  <CalendarDays size={16} className="text-gold" />
                  Prochains événements
                </p>
                <Link to="/evenements" className="text-xs font-medium text-gold hover:underline">
                  Tous les événements
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                {upcomingEvents.map((event) => {
                  const { day, month } = formatEventDate(event.starts_at);
                  return (
                    <Link
                      to="/evenements"
                      key={event.id}
                      className="card-panel flex gap-4 p-4 transition-colors hover:border-gold/40"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gold/10 text-gold">
                        <span className="text-lg font-bold leading-none">{day}</span>
                        <span className="text-[0.65rem] font-semibold uppercase">{month}</span>
                      </div>
                      <div>
                        <p className="font-medium text-paper">{event.title}</p>
                        <p className="mt-1 line-clamp-1 text-sm text-mist">
                          {event.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Reveal>

            <Reveal className="lg:col-span-2" delay={200}>
              <p className="flex items-center gap-2 text-sm font-semibold text-paper">
                <PlayCircle size={16} className="text-gold" />
                Derniers sermons
              </p>
              <div className="mt-5 space-y-4">
                {mockSermons.slice(0, 3).map((sermon) => (
                  <button
                    key={sermon.id}
                    onClick={() => setActiveSermon(sermon)}
                    className="card-panel flex w-full items-center gap-4 p-3 text-left transition-colors hover:border-gold/40"
                  >
                    <img
                      src={sermon.thumbnail_url}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-paper">
                        {sermon.title}
                      </p>
                      <p className="text-xs text-mist">{sermon.speaker}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Worship times */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="eyebrow text-center">Nous rejoindre</p>
          <h2 className="section-title mt-2 text-center">Horaires de culte</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {worshipServiceTimes.map((service, i) => (
            <Reveal key={service.id} delay={i * 80}>
              <div className="card-panel h-full p-6 text-center">
                <Clock size={22} className="mx-auto text-gold" />
                <p className="mt-4 font-display text-lg font-semibold text-paper">
                  {service.label}
                </p>
                <p className="mt-1 text-sm text-mist">
                  {service.day} · {service.time}
                </p>
                <p className="mt-1 text-xs text-mist/70">{service.location}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="bg-charcoal-soft px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Où nous trouver</p>
            <h2 className="section-title mt-2">Venez comme vous êtes</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
              Nous sommes situés au cœur de la ville, avec un parking
              disponible et un accueil chaque dimanche dès 8h30.
            </p>
            <div className="mt-6 flex items-start gap-2 text-sm text-paper/90">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
              Avenue de la Réconciliation, Douala, Cameroun
            </div>
            <Link to="/contact" className="btn-outline mt-6 w-fit">
              Itinéraire &amp; contact
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="h-80 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Localisation de Christ Mission Church"
                className="h-full w-full grayscale invert-[0.92]"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.68%2C4.03%2C9.78%2C4.09&layer=mapnik"
              />
            </div>
          </Reveal>
        </div>
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
