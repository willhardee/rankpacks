alter table packs add column if not exists creator_name text default 'Guest';
alter table packs alter column owner_id drop not null;
alter table packs alter column status set default 'open';

alter table pack_items add column if not exists position int;

create table if not exists ranking_submissions (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references packs(id) on delete cascade,
  user_id uuid references profiles(user_id) on delete set null,
  display_name text not null default 'Guest',
  ordered_item_ids jsonb not null,
  submitted_at timestamptz not null default now()
);

create index if not exists ranking_submissions_pack_id_idx on ranking_submissions(pack_id);
create index if not exists ranking_submissions_submitted_at_idx on ranking_submissions(submitted_at desc);

alter table ranking_submissions enable row level security;

drop policy if exists "public can read public pack submissions" on ranking_submissions;
create policy "public can read public pack submissions"
  on ranking_submissions
  for select
  using (
    exists (
      select 1 from packs p where p.id = ranking_submissions.pack_id and p.visibility = 'public'
    )
  );

drop policy if exists "service role can manage ranking submissions" on ranking_submissions;
create policy "service role can manage ranking submissions"
  on ranking_submissions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
