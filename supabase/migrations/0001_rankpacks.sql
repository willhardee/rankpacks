create extension if not exists "pgcrypto";

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  notif_prefs jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists packs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(user_id),
  title text not null,
  category text not null,
  visibility text not null check (visibility in ('link-only','public')),
  cover_url text,
  status text not null default 'draft' check (status in ('draft','open','locked','revealed')),
  created_at timestamptz not null default now(),
  opened_at timestamptz,
  locked_at timestamptz,
  revealed_at timestamptz,
  location text,
  scheduled_for timestamptz
);

create table if not exists pack_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references packs(id) on delete cascade,
  name text not null,
  image_url text,
  buy_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists pack_members (
  pack_id uuid references packs(id) on delete cascade,
  user_id uuid references profiles(user_id) on delete cascade,
  role text not null check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key(pack_id, user_id)
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references packs(id) on delete cascade,
  inviter_id uuid not null references profiles(user_id),
  email text,
  token text not null unique,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create table if not exists rankings (
  pack_id uuid references packs(id) on delete cascade,
  user_id uuid references profiles(user_id) on delete cascade,
  ordered_item_ids jsonb not null,
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  primary key(pack_id, user_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references packs(id) on delete cascade,
  user_id uuid not null references profiles(user_id),
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists comment_reactions (
  comment_id uuid references comments(id) on delete cascade,
  user_id uuid references profiles(user_id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  primary key(comment_id, user_id, emoji)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(user_id),
  pack_id uuid references packs(id),
  comment_id uuid references comments(id),
  reason text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references profiles(user_id)
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(user_id) on delete cascade,
  type text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(user_id),
  session_id text,
  name text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists invite_codes (
  code text primary key,
  max_uses int not null default 1,
  uses int not null default 0,
  created_at timestamptz not null default now(),
  disabled_at timestamptz
);

alter table profiles enable row level security;
alter table packs enable row level security;
alter table pack_items enable row level security;
alter table pack_members enable row level security;
alter table invites enable row level security;
alter table rankings enable row level security;
alter table comments enable row level security;
alter table comment_reactions enable row level security;
alter table reports enable row level security;
alter table notifications enable row level security;
alter table events enable row level security;
alter table waitlist enable row level security;
alter table invite_codes enable row level security;

create policy "users can view own profile" on profiles for select using (auth.uid() = user_id);
create policy "users can update own profile" on profiles for update using (auth.uid() = user_id);
create policy "users can insert own profile" on profiles for insert with check (auth.uid() = user_id);

create policy "members can view packs" on packs for select using (
  visibility = 'public' or owner_id = auth.uid() or exists (select 1 from pack_members pm where pm.pack_id = packs.id and pm.user_id = auth.uid())
);
create policy "owners can manage packs" on packs for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "members can view items" on pack_items for select using (
  exists (select 1 from packs p where p.id = pack_items.pack_id and (p.visibility='public' or p.owner_id=auth.uid() or exists (select 1 from pack_members pm where pm.pack_id = p.id and pm.user_id = auth.uid())))
);
create policy "owners can mutate items" on pack_items for all using (
  exists (select 1 from packs p where p.id = pack_items.pack_id and p.owner_id = auth.uid())
) with check (
  exists (select 1 from packs p where p.id = pack_items.pack_id and p.owner_id = auth.uid())
);
