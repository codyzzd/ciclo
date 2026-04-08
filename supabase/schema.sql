-- Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz default now()
);

-- Cycle days
create table if not exists cycle_days (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  date date not null,
  menstruou boolean default false,
  intensidade text check (intensidade in ('leve', 'medio', 'intenso')),
  created_at timestamptz default now(),
  unique(profile_id, date)
);

-- Indexes
create index if not exists cycle_days_profile_id_idx on cycle_days(profile_id);
create index if not exists cycle_days_date_idx on cycle_days(date);
