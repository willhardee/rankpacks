-- Core flow hardening: profile bootstrap + ranking visibility policies

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "users can view rankings for readable packs" on rankings;
create policy "users can view rankings for readable packs"
on rankings for select
using (
  exists (
    select 1 from packs p
    where p.id = rankings.pack_id
      and (p.visibility = 'public' or p.owner_id = auth.uid())
  )
);

drop policy if exists "users can write own rankings" on rankings;
create policy "users can write own rankings"
on rankings for insert
with check (auth.uid() = user_id);

drop policy if exists "users can update own rankings" on rankings;
create policy "users can update own rankings"
on rankings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
