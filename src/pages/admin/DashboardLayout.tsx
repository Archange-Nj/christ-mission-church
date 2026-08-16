import { NavLink, Navigate, Outlet, Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  Clock,
  ExternalLink,
  HandCoins,
  Loader2,
  LogOut,
  Mail,
  MessageCircleHeart,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';

const navItems = [
  { label: 'Aperçu', href: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Sermons', href: '/dashboard/sermons', icon: BookOpen },
  { label: 'Événements', href: '/dashboard/evenements', icon: CalendarDays },
  { label: 'Horaires de culte', href: '/dashboard/horaires', icon: Clock },
  {
    label: 'Demandes de prière',
    href: '/dashboard/prieres',
    icon: MessageCircleHeart,
  },
  { label: 'Dons', href: '/dashboard/dons', icon: HandCoins },
  { label: 'Messages', href: '/dashboard/messages', icon: Mail },
];

export default function DashboardLayout() {
  const { session, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Loader2 size={24} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-charcoal">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-charcoal-soft p-5 lg:block">
        <p className="px-2 font-display text-lg font-semibold text-gold">
          Christ Mission
        </p>
        <p className="px-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-mist">
          Dashboard admin
        </p>

        <nav className="mt-8 space-y-1">
          {navItems.map(({ label, href, icon: Icon, end }) => (
            <NavLink
              key={href}
              to={href}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-mist hover:bg-white/5 hover:text-paper'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => signOut()}
          className="mt-8 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-mist transition-colors hover:bg-white/5 hover:text-paper"
        >
          <LogOut size={16} /> Se déconnecter
        </button>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-mist transition-colors hover:bg-white/5 hover:text-gold"
        >
          <ExternalLink size={16} /> Voir le site
        </Link>
      </aside>

      <div className="flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-charcoal-soft px-4 py-3 lg:hidden">
          <p className="font-display text-base font-semibold text-gold">
            Dashboard
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-mist"
            >
              <ExternalLink size={14} /> Site
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-xs text-mist"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl p-5 sm:p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-white/10 bg-charcoal-soft py-2 lg:hidden">
        {navItems.map(({ href, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 text-[0.6rem] ${
                isActive ? 'text-gold' : 'text-mist'
              }`
            }
          >
            <Icon size={18} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}