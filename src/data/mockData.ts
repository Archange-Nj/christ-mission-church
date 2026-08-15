import type {
  ChurchEvent,
  Sermon,
  ServiceGroup,
  WorshipServiceTime,
} from '../types';

export const mockSermons: Sermon[] = [
  {
    id: 's1',
    title: "Marcher par la foi, pas par la vue",
    speaker: 'Pasteur Samuel Eto',
    series: 'Fondations',
    theme: 'Foi',
    description:
      "Une exploration de 2 Corinthiens 5 sur ce que signifie faire confiance à Dieu au-delà de ce que nous pouvons voir ou comprendre.",
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url:
      'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-08-02',
    duration_minutes: 42,
  },
  {
    id: 's2',
    title: 'Le pardon qui libère',
    speaker: 'Pasteur Samuel Eto',
    series: 'Fondations',
    theme: 'Pardon',
    description:
      'Comment le pardon reçu en Christ nous rend capables de pardonner à notre tour, sans minimiser la blessure.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url:
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-07-26',
    duration_minutes: 38,
  },
  {
    id: 's3',
    title: "Servir comme Jésus a servi",
    speaker: 'Pasteure Grace Mballa',
    series: 'Vie de disciple',
    theme: 'Service',
    description:
      "Un message sur le lavement des pieds en Jean 13, et ce que le service désintéressé change dans une communauté.",
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url:
      'https://images.unsplash.com/photo-1493804714600-6edb1cd93080?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-07-19',
    duration_minutes: 45,
  },
  {
    id: 's4',
    title: 'Prier sans se lasser',
    speaker: 'Pasteur Samuel Eto',
    series: 'Vie de prière',
    theme: 'Prière',
    description:
      "À partir de Luc 18, un enseignement sur la persévérance dans la prière et la confiance en la bonté de Dieu.",
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url:
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-07-12',
    duration_minutes: 40,
  },
];

export const mockEvents: ChurchEvent[] = [
  {
    id: 'e1',
    title: 'Nuit de louange et adoration',
    description:
      "Une soirée entière consacrée au chant, à la prière et à l'adoration communautaire.",
    location: 'Sanctuaire principal',
    category: 'special',
    starts_at: '2026-08-22T19:00:00',
    ends_at: '2026-08-22T21:30:00',
    image_url:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    registration_required: false,
    capacity: null,
    spots_taken: null,
  },
  {
    id: 'e2',
    title: 'Retraite des jeunes',
    description:
      'Un week-end hors de la ville pour les 15-25 ans : enseignement, sport et vie communautaire.',
    location: 'Centre Emmanuel, Bafou',
    category: 'jeunesse',
    starts_at: '2026-09-05T08:00:00',
    ends_at: '2026-09-07T17:00:00',
    image_url:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop',
    registration_required: true,
    capacity: 60,
    spots_taken: 41,
  },
  {
    id: 'e3',
    title: 'Petit-déjeuner des hommes',
    description:
      "Un temps de partage et d'enseignement autour d'un petit-déjeuner, ouvert à tous les hommes de l'église.",
    location: 'Salle polyvalente',
    category: 'communaute',
    starts_at: '2026-08-16T08:00:00',
    ends_at: '2026-08-16T10:00:00',
    image_url:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    registration_required: true,
    capacity: 40,
    spots_taken: 22,
  },
  {
    id: 'e4',
    title: 'Chaîne de prière du mercredi',
    description:
      'Une heure de prière collective pour les besoins de nos familles et de notre nation.',
    location: 'Chapelle',
    category: 'priere',
    starts_at: '2026-08-20T18:00:00',
    ends_at: '2026-08-20T19:00:00',
    image_url:
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
    registration_required: false,
    capacity: null,
    spots_taken: null,
  },
];

export const worshipServiceTimes: WorshipServiceTime[] = [
  {
    id: 'w1',
    label: 'Culte principal',
    day: 'Dimanche',
    time: '9h00 & 11h00',
    location: 'Sanctuaire principal',
  },
  {
    id: 'w2',
    label: 'École du dimanche',
    day: 'Dimanche',
    time: '8h30',
    location: 'Bâtiment annexe',
  },
  {
    id: 'w3',
    label: 'Étude biblique',
    day: 'Mercredi',
    time: '18h00',
    location: 'Salle polyvalente',
  },
  {
    id: 'w4',
    label: 'Prière du matin',
    day: 'Vendredi',
    time: '6h00',
    location: 'Chapelle',
  },
];

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'g1',
    title: 'Communautés de maison',
    description:
      'De petits groupes qui se réunissent chaque semaine pour étudier la Parole et prier ensemble.',
    image_url:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    href: '/a-propos#communautes',
  },
  {
    id: 'g2',
    title: 'Sermons récents',
    description:
      "Retrouvez nos derniers messages en vidéo, classés par thème et par prédicateur.",
    image_url:
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200&auto=format&fit=crop',
    href: '/sermons',
  },
  {
    id: 'g3',
    title: 'Mariages & baptêmes',
    description:
      "Nous accompagnons les couples et les nouveaux croyants à chaque étape de ces moments sacrés.",
    image_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    href: '/contact',
  },
  {
    id: 'g4',
    title: 'Événements spéciaux',
    description:
      "Conférences, veillées et rassemblements qui rythment la vie de notre église toute l'année.",
    image_url:
      'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1200&auto=format&fit=crop',
    href: '/evenements',
  },
];
