import { Link } from 'react-router-dom';
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';
import { worshipServiceTimes } from '../data/mockData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-gold">
            Christ Mission Church
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Une communauté unie par la foi en Jésus-Christ, appelée à vivre
            son Évangile chaque jour.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Réseau social"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-mist transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Liens rapides</p>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            <li><Link to="/a-propos" className="hover:text-gold">À propos</Link></li>
            <li><Link to="/sermons" className="hover:text-gold">Sermons</Link></li>
            <li><Link to="/evenements" className="hover:text-gold">Événements</Link></li>
            <li><Link to="/dons" className="hover:text-gold">Faire un don</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Demande de prière</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow flex items-center gap-2">
            <Clock size={13} /> Horaires de culte
          </p>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            {worshipServiceTimes.map((service) => (
              <li key={service.id} className="flex justify-between gap-4">
                <span>{service.label}</span>
                <span className="text-paper/80">
                  {service.day}, {service.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-mist">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              Avenue de la Réconciliation, Douala, Cameroun
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-gold" />
              +237 6 00 00 00 00
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-gold" />
              contact@christmissionchurch.org
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="text-center text-xs text-mist">
          © {year} Christ Mission Church. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
