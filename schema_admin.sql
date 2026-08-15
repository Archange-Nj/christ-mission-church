-- ============================================================================
-- Christ Mission Church — Admin dashboard addon
-- Run this AFTER schema.sql, in the Supabase SQL editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- WORSHIP SERVICE TIMES (editable from the admin dashboard)
-- ----------------------------------------------------------------------------
create table if not exists public.worship_service_times (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  day text not null,
  time text not null,
  location text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.worship_service_times enable row level security;

create policy "Worship times are publicly readable"
  on public.worship_service_times for select
  using (true);

create policy "Only authenticated staff can manage worship times"
  on public.worship_service_times for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.worship_service_times (label, day, time, location, sort_order)
values
  ('Culte principal', 'Dimanche', '9h00 & 11h00', 'Sanctuaire principal', 1),
  ('École du dimanche', 'Dimanche', '8h30', 'Bâtiment annexe', 2),
  ('Étude biblique', 'Mercredi', '18h00', 'Salle polyvalente', 3),
  ('Prière du matin', 'Vendredi', '6h00', 'Chapelle', 4)
on conflict do nothing;

create index if not exists idx_worship_service_times_sort on public.worship_service_times (sort_order asc);

-- ============================================================================
-- CRÉER UN COMPTE ADMIN
-- ============================================================================
-- Le formulaire de connexion du dashboard (/dashboard/login) utilise
-- Supabase Auth (email + mot de passe). Il n'y a AUCUNE page d'inscription
-- publique dans le site : les comptes admin se créent uniquement depuis le
-- tableau de bord Supabase.
--
-- Pour créer le premier compte admin :
--   1. Dashboard Supabase → Authentication → Users → "Add user"
--   2. Renseigne un email et un mot de passe
--   3. Coche "Auto Confirm User" (sinon un email de confirmation est requis)
--   4. Utilise ces identifiants pour te connecter sur /dashboard/login
--
-- Toutes les policies RLS ci-dessus (et dans schema.sql) autorisent déjà
-- toute écriture/lecture admin via `auth.role() = 'authenticated'` — donc
-- n'importe quel compte créé de cette façon a automatiquement accès au
-- dashboard complet.
