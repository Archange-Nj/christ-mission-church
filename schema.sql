-- ============================================================================
-- Christ Mission Church — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- SERMONS
-- ----------------------------------------------------------------------------
create table if not exists public.sermons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  speaker text not null,
  series text,
  theme text not null,
  description text not null default '',
  youtube_url text not null,
  thumbnail_url text not null,
  published_at date not null default current_date,
  duration_minutes integer,
  created_at timestamptz not null default now()
);

alter table public.sermons enable row level security;

create policy "Sermons are publicly readable"
  on public.sermons for select
  using (true);

create policy "Only authenticated staff can manage sermons"
  on public.sermons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- EVENTS
-- ----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  location text not null default '',
  category text not null default 'communaute'
    check (category in ('culte', 'priere', 'jeunesse', 'communaute', 'special')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  image_url text,
  registration_required boolean not null default false,
  capacity integer,
  spots_taken integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Events are publicly readable"
  on public.events for select
  using (true);

create policy "Only authenticated staff can manage events"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- EVENT REGISTRATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  guests integer not null default 1,
  message text,
  created_at timestamptz not null default now()
);

alter table public.event_registrations enable row level security;

create policy "Anyone can register for an event"
  on public.event_registrations for insert
  with check (true);

create policy "Only authenticated staff can read registrations"
  on public.event_registrations for select
  using (auth.role() = 'authenticated');

-- Keep spots_taken in sync automatically.
create or replace function public.increment_event_spots()
returns trigger as $$
begin
  update public.events
  set spots_taken = spots_taken + new.guests
  where id = new.event_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_event_registration_created on public.event_registrations;
create trigger on_event_registration_created
  after insert on public.event_registrations
  for each row execute function public.increment_event_spots();

-- ----------------------------------------------------------------------------
-- PRAYER REQUESTS (confidential)
-- ----------------------------------------------------------------------------
create table if not exists public.prayer_requests (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  category text not null default 'autre'
    check (category in ('sante', 'famille', 'travail', 'spirituel', 'deuil', 'autre')),
  message text not null,
  is_confidential boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.prayer_requests enable row level security;

create policy "Anyone can submit a prayer request"
  on public.prayer_requests for insert
  with check (true);

create policy "Only authenticated staff can read prayer requests"
  on public.prayer_requests for select
  using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- CONTACT MESSAGES
-- ----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Only authenticated staff can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- DONATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.donations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'XAF' check (currency in ('XAF', 'USD', 'EUR')),
  fund text not null default 'general'
    check (fund in ('general', 'missions', 'construction', 'jeunesse', 'benevolence')),
  method text not null check (method in ('card', 'mobile_money', 'bank_transfer')),
  is_recurring boolean not null default false,
  message text,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

create policy "Anyone can record a donation"
  on public.donations for insert
  with check (true);

create policy "Only authenticated staff can read donations"
  on public.donations for select
  using (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA
-- ============================================================================

insert into public.sermons (title, speaker, series, theme, description, youtube_url, thumbnail_url, published_at, duration_minutes)
values
  ('Marcher par la foi, pas par la vue', 'Pasteur Samuel Eto', 'Fondations', 'Foi',
   'Une exploration de 2 Corinthiens 5 sur ce que signifie faire confiance à Dieu au-delà de ce que nous pouvons voir.',
   'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
   'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?q=80&w=1200&auto=format&fit=crop',
   '2026-08-02', 42),
  ('Le pardon qui libère', 'Pasteur Samuel Eto', 'Fondations', 'Pardon',
   'Comment le pardon reçu en Christ nous rend capables de pardonner à notre tour.',
   'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
   'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1200&auto=format&fit=crop',
   '2026-07-26', 38),
  ('Servir comme Jésus a servi', 'Pasteure Grace Mballa', 'Vie de disciple', 'Service',
   'Un message sur le lavement des pieds en Jean 13.',
   'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
   'https://images.unsplash.com/photo-1493804714600-6edb1cd93080?q=80&w=1200&auto=format&fit=crop',
   '2026-07-19', 45)
on conflict do nothing;

insert into public.events (title, description, location, category, starts_at, ends_at, image_url, registration_required, capacity, spots_taken)
values
  ('Nuit de louange et adoration', 'Une soirée entière consacrée au chant et à la prière.', 'Sanctuaire principal', 'special',
   '2026-08-22T19:00:00+01', '2026-08-22T21:30:00+01',
   'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop', false, null, 0),
  ('Retraite des jeunes', 'Un week-end hors de la ville pour les 15-25 ans.', 'Centre Emmanuel, Bafou', 'jeunesse',
   '2026-09-05T08:00:00+01', '2026-09-07T17:00:00+01',
   'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop', true, 60, 41),
  ('Petit-déjeuner des hommes', 'Un temps de partage autour d''un petit-déjeuner.', 'Salle polyvalente', 'communaute',
   '2026-08-16T08:00:00+01', '2026-08-16T10:00:00+01',
   'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop', true, 40, 22)
on conflict do nothing;

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_sermons_published_at on public.sermons (published_at desc);
create index if not exists idx_events_starts_at on public.events (starts_at asc);
create index if not exists idx_event_registrations_event_id on public.event_registrations (event_id);
