import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ChevronDown,
  Mail,
  Menu,
  PlayCircle,
  X,
} from 'lucide-react';

interface DropdownLink {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownLink[];
}

const navItems: NavItem[] = [
  {
    label: 'À propos',
    dropdown: [
      { label: 'Notre histoire', href: '/a-propos' },
      { label: 'Notre équipe', href: '/a-propos#equipe' },
      { label: 'Ce que nous croyons', href: '/a-propos#croyances' },
    ],
  },
  {
    label: 'Ministères',
    dropdown: [
      { label: 'Communautés de maison', href: '/a-propos#communautes' },
      { label: 'Jeunesse', href: '/evenements?categorie=jeunesse' },
      { label: 'Louange & adoration', href: '/sermons' },
    ],
  },
  {
    label: 'Médias & Sermons',
    dropdown: [
      { label: 'Tous les sermons', href: '/sermons' },
      { label: 'En direct', href: '/sermons#direct' },
    ],
  },
  { label: 'Événements', href: '/evenements' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-charcoal/95 shadow-lg shadow-black/30 backdrop-blur-md'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      {/* Utility bar */}
      <div className="hidden border-b border-white/5 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-6 px-6 py-2 text-xs text-mist">
          <Link
            to="/sermons#direct"
            className="flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <PlayCircle size={14} /> Média
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <Mail size={14} /> Contact
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-wide text-gold sm:text-2xl">
            CHRIST MISSION
          </span>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-mist">
            Church
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.dropdown ? (
                <>
                  <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-paper/90 transition-colors hover:text-gold">
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full w-56 overflow-hidden rounded-xl border border-white/10 bg-charcoal-panel shadow-xl animate-fadeUp">
                      {item.dropdown.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          className="block px-4 py-3 text-sm text-paper/85 transition-colors hover:bg-white/5 hover:text-gold"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.href!}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-gold' : 'text-paper/90 hover:text-gold'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/dons" className="btn-gold">
            Faire un don
          </Link>
        </div>

        <button
          className="rounded-full p-2 text-paper lg:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-white/10 bg-charcoal px-6 pb-6 pt-2 lg:hidden">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-white/5 py-2">
              {item.dropdown ? (
                <details>
                  <summary className="cursor-pointer list-none py-2 text-sm font-medium text-paper">
                    {item.label}
                  </summary>
                  <div className="ml-3 flex flex-col gap-1 pb-2">
                    {item.dropdown.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="py-1.5 text-sm text-mist hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  to={item.href!}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm font-medium text-paper"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link
            to="/dons"
            onClick={() => setIsOpen(false)}
            className="btn-gold mt-4 w-full"
          >
            Faire un don
          </Link>
        </div>
      )}
    </header>
  );
}
