-- Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  created_at timestamptz default now()
);

-- Cycle days
create table if not exists cycle_days (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  menstruou boolean default false,
  intensidade text check (intensidade in ('leve', 'medio', 'intenso')),
  sexo boolean default false,
  created_at timestamptz default now(),
  unique(profile_id, date)
);

-- Indexes
create index if not exists cycle_days_profile_id_idx on cycle_days(profile_id);
create index if not exists cycle_days_date_idx on cycle_days(date);

-- Row Level Security
alter table profiles enable row level security;
alter table cycle_days enable row level security;

create policy "users see own profiles"
  on profiles for all
  using (auth.uid() = user_id);

create policy "users see own cycle_days"
  on cycle_days for all
  using (
    profile_id in (select id from profiles where user_id = auth.uid())
  );
