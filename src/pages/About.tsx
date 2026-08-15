import Reveal from '../components/Reveal';
import { Heart, Users, BookOpen } from 'lucide-react';
import { serviceGroups } from '../data/mockData';

const beliefs = [
  {
    title: 'La Parole de Dieu',
    text: 'Nous croyons que la Bible est la Parole inspirée de Dieu, notre seule règle de foi et de conduite.',
  },
  {
    title: 'Le salut par la grâce',
    text: 'Le salut est un don gratuit reçu par la foi en Jésus-Christ, et non par nos œuvres.',
  },
  {
    title: "L'Église, corps du Christ",
    text: "Nous croyons en une communion fraternelle vivante, appelée à servir et à s'édifier mutuellement.",
  },
];

const team = [
  {
    name: 'Pasteur Samuel Eto',
    role: 'Pasteur principal',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Pasteure Grace Mballa',
    role: 'Pasteure associée',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Diacre Paul Nguema',
    role: 'Responsable communautés',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
  },
];

export default function About() {
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <Reveal>
          <p className="eyebrow">Qui nous sommes</p>
          <h1 className="section-title mt-2">Notre histoire</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mist">
            Christ Mission Church est née il y a plus de vingt ans d'un
            petit groupe de prière réuni dans un salon. Aujourd'hui, notre
            église rassemble des familles de tous horizons, unies par une
            même foi et un même désir : connaître Dieu et le faire connaître.
          </p>
        </Reveal>
      </section>

      <section id="croyances" className="bg-charcoal-soft px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow text-center">Nos fondements</p>
            <h2 className="section-title mt-2 text-center">Ce que nous croyons</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {beliefs.map((belief, i) => (
              <Reveal key={belief.title} delay={i * 100}>
                <div className="card-panel h-full p-6">
                  <BookOpen size={20} className="text-gold" />
                  <p className="mt-4 font-display text-lg font-semibold text-paper">
                    {belief.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {belief.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="equipe" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="eyebrow text-center">L'équipe pastorale</p>
          <h2 className="section-title mt-2 text-center">Nos bergers</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 100}>
              <div className="card-panel overflow-hidden text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <p className="font-display text-lg font-semibold text-paper">
                    {member.name}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-gold">
                    {member.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="communautes" className="bg-charcoal-soft px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-center justify-center gap-2">
              <Users size={20} className="text-gold" />
              <p className="eyebrow">Vie communautaire</p>
            </div>
            <h2 className="section-title mt-2 text-center">
              Communautés de maison
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-mist">
              Chaque semaine, nos communautés de maison se réunissent pour
              étudier la Bible, prier et partager un repas. C'est là que
              naissent les amitiés durables et l'entraide au quotidien.
            </p>
          </Reveal>
          <div className="mt-10 flex justify-center">
            <a href="/contact" className="btn-gold">
              <Heart size={16} /> Rejoindre une communauté
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {serviceGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 100}>
              <a
                href={group.href}
                className="group relative block h-48 overflow-hidden rounded-2xl"
              >
                <img
                  src={group.image_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <p className="absolute bottom-4 left-4 font-display text-lg font-semibold text-paper">
                  {group.title}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
