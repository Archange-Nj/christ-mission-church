# Christ Mission Church — Site web

Application web pour **Christ Mission Church** (christmissionchurch.org),
construite en React (Vite) + TypeScript + Tailwind CSS, avec Supabase pour
les sermons, événements, demandes de prière et dons.

## Démarrage rapide

```bash
npm install
cp .env.example .env      # puis renseigner vos clés Supabase
npm run dev
```

Le site fonctionne aussi **sans Supabase configuré** : toutes les pages
retombent automatiquement sur les données de démonstration situées dans
`src/data/mockData.ts`, et les formulaires simulent un envoi réussi. Dès que
`.env` contient une URL et une clé Supabase valides, l'app bascule
automatiquement sur les vraies données.

## Base de données Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Ouvrez l'éditeur SQL du projet et exécutez le contenu de `schema.sql`
   (tables `sermons`, `events`, `event_registrations`, `prayer_requests`,
   `contact_messages`, `donations`, avec RLS et données de test).
3. Copiez l'URL du projet et la clé `anon` dans `.env`.

## Déploiement (Vercel)

```bash
npm run build
```

Connectez le dépôt à Vercel, ajoutez les variables d'environnement
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les réglages du
projet, puis déployez. Le dossier de build est `dist/`.

## Arborescence

```
├── schema.sql                  # Schéma Supabase complet (tables + RLS + seed)
├── src/
│   ├── components/             # Navbar, Footer, Reveal, VideoModal
│   ├── data/mockData.ts        # Données de secours si Supabase n'est pas connecté
│   ├── lib/supabase.ts         # Client Supabase
│   ├── pages/                  # Home, About, Sermons, Events, Give, Contact
│   ├── types/index.ts          # Types partagés (Sermon, ChurchEvent, Donation, ...)
│   ├── App.tsx                 # Routing
│   └── main.tsx
```

## Prochaines étapes suggérées

- Remplacer les images Unsplash de démonstration par de vraies photos de l'église.
- Brancher un vrai module de paiement (Stripe, CinetPay, etc.) sur la page Dons.
- Ajouter une authentification Supabase pour un espace admin (gestion des sermons/événements).
