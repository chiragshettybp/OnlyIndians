-- Auth & Onboarding Module: profiles, creator_profiles, identity_verifications,
-- triggers, phone-first login RPCs, and private storage buckets.
-- Product rules: India-only +91, NO SMS/phone OTP, email is the auth credential
-- (Supabase Auth), email must be verified before onboarding. Phone is stored as
-- the primary displayed identifier on profiles.phone.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  role                text not null check (role in ('subscriber','creator')),
  email               text not null unique,
  phone               text not null unique check (phone ~ '^\+91[6-9][0-9]{9}$'),
  email_verified_at   timestamptz,
  status              text not null default 'active' check (status in ('active','suspended','deleted','banned')),
  username            text unique check (username = lower(username)),
  display_name        text,
  bio                 text,
  avatar_url          text,
  banner_url          text,
  languages           text[] not null default '{en}',
  interests           text[] not null default '{}',
  content_language    text,
  notify_email        boolean not null default true,
  notify_push         boolean not null default true,
  onboarded           boolean not null default false,
  onboarded_at        timestamptz,
  blocked_at          timestamptz,
  suspended_at        timestamptz,
  deleted_at          timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists profiles_role_status_idx on public.profiles (role, status);
create index if not exists profiles_username_idx on public.profiles (lower(username));

-- ---------------------------------------------------------------------------
-- creator_profiles (creator-only detail; never populated for subscribers)
-- ---------------------------------------------------------------------------
create table if not exists public.creator_profiles (
  id                  uuid primary key references public.profiles(id) on delete cascade,
  category            text,
  primary_discipline  text,
  blurb               text,
  subscription_price  int check (subscription_price between 99 and 9999),
  kyc_status          text not null default 'not_submitted' check (kyc_status in ('not_submitted','pending','approved','rejected')),
  payout_status       text not null default 'not_configured' check (payout_status in ('not_configured','configured','disabled')),
  bank_ifsc           text,
  bank_account_tail   text,
  bank_holder         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- identity_verifications (KYC submissions; reviewed service-side/admin)
-- ---------------------------------------------------------------------------
create table if not exists public.identity_verifications (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  id_type            text not null check (id_type in ('PAN','AADHAAR','PASSPORT','DRIVING_LICENSE')),
  id_last4           text not null,
  doc_paths          jsonb not null default '[]'::jsonb,
  status             text not null default 'pending' check (status in ('pending','approved','rejected')),
  rejection_reason   text,
  submitted_at       timestamptz not null default now(),
  reviewed_at        timestamptz,
  reviewed_by        uuid
);

create index if not exists identity_verifications_user_idx on public.identity_verifications (user_id, status);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.identity_verifications enable row level security;

alter table public.profiles replica identity full;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or (role = 'creator' and onboarded and status = 'active'));

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists creator_profiles_select on public.creator_profiles;
create policy creator_profiles_select on public.creator_profiles for select
  using (id = auth.uid());

drop policy if exists creator_profiles_insert on public.creator_profiles;
create policy creator_profiles_insert on public.creator_profiles for insert
  with check (id = auth.uid());

drop policy if exists creator_profiles_update on public.creator_profiles;
create policy creator_profiles_update on public.creator_profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists identity_verifications_select on public.identity_verifications;
create policy identity_verifications_select on public.identity_verifications for select
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Guards & triggers
-- ---------------------------------------------------------------------------
create or replace function public.guard_profile_write() returns trigger
language plpgsql security invoker as $$
begin
  if TG_OP = 'UPDATE' and NEW.role is distinct from OLD.role then
    raise exception 'profiles.role is immutable';
  end if;
  if TG_OP = 'UPDATE' and NEW.email is distinct from OLD.email then
    raise exception 'profiles.email is managed by Supabase Auth';
  end if;
  return NEW;
end $$;

drop trigger if exists guard_profile_write on public.profiles;
create trigger guard_profile_write before update on public.profiles
  for each row execute function public.guard_profile_write();

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists creator_profiles_set_updated_at on public.creator_profiles;
create trigger creator_profiles_set_updated_at before update on public.creator_profiles
  for each row execute function public.set_updated_at();

-- Create the profiles row the moment a user signs up (role captured at signup,
-- immutable afterwards). No phone OTP anywhere — email confirms via Supabase Auth.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  req_role text := new.raw_user_meta_data->>'role';
  p_phone  text := regexp_replace(coalesce(new.raw_user_meta_data->>'mobile',''), '[^0-9+]', '', 'g');
  p_user   text := lower(coalesce(new.raw_user_meta_data->>'username',''));
  p_name   text := nullif(new.raw_user_meta_data->>'display_name','');
begin
  if req_role not in ('subscriber','creator') then
    raise exception 'invalid registration role';
  end if;
  if p_phone similar to '91[6-9][0-9]{9}' then
    p_phone := '+' || p_phone;
  elsif p_phone similar to '[6-9][0-9]{9}' then
    p_phone := '+91' || p_phone;
  end if;
  if p_phone !~ '^\+91[6-9][0-9]{9}$' then
    raise exception 'phone must be a valid +91 Indian mobile number';
  end if;
  insert into public.profiles (id, role, email, phone, username, display_name)
  values (new.id, req_role, new.email, p_phone, nullif(p_user,''), p_name)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------
-- Phone-first login: maps a normalized +91 phone to the account email so the
-- client can call signInWithPassword. Generic/failed lookups return no rows.
create or replace function public.resolve_login_email(p_phone text)
returns table (email text)
language sql security definer set search_path = public, pg_temp as $$
  select p.email
  from public.profiles p
  where p.phone = regexp_replace(coalesce(p_phone,''), '[^0-9+]', '', 'g')
    and p.deleted_at is null;
$$;

create or replace function public.check_username_available(p_username text)
returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  slug text := lower(regexp_replace(coalesce(p_username,''), '[^a-z0-9_]', '', 'g'));
begin
  if slug = '' or slug !~ '^[a-z0-9_]{3,30}$' then return false; end if;
  return not exists (select 1 from public.profiles where username = slug);
end $$;

-- Marks email as verified on profiles once Supabase confirms the address.
create or replace function public.complete_email_verification(p_uid uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null or auth.uid() <> p_uid then
    raise exception 'forbidden';
  end if;
  update public.profiles
     set email_verified_at = now()
   where id = p_uid and email_verified_at is null;
end $$;

-- Owner-only KYC submission; status always forced to pending regardless of input.
create or replace function public.submit_identity_verification(
  p_id_type text,
  p_id_last4 text,
  p_doc_paths jsonb
) returns uuid
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  vid uuid;
begin
  if auth.uid() is null then raise exception 'forbidden'; end if;
  if p_id_type not in ('PAN','AADHAAR','PASSPORT','DRIVING_LICENSE') then
    raise exception 'invalid id type';
  end if;
  if p_id_last4 !~ '^[0-9A-Z]{4}$' then
    raise exception 'invalid id reference';
  end if;
  insert into public.identity_verifications (user_id, id_type, id_last4, doc_paths, status)
  values (auth.uid(), p_id_type, upper(p_id_last4), p_doc_paths, 'pending')
  returning id into vid;
  update public.creator_profiles set kyc_status = 'pending' where id = auth.uid();
  return vid;
end $$;

-- ---------------------------------------------------------------------------
-- Private storage buckets (no public objects ever)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars','avatars',false),('banners','banners',false),('media','media',false),('documents','documents',false)
on conflict (id) do nothing;

do $$
declare b text;
begin
  foreach b in array array['avatars','banners','media','documents'] loop
    execute format('drop policy if exists %I on storage.objects', 'own_' || b);
    execute format('create policy %I on storage.objects for select using (bucket_id = %L and owner = auth.uid())', 'own_' || b, b);
    execute format('drop policy if exists %I on storage.objects', 'own_up_' || b);
    execute format('create policy %I on storage.objects for insert with check (bucket_id = %L and owner = auth.uid())', 'own_up_' || b, b);
    execute format('drop policy if exists %I on storage.objects', 'own_del_' || b);
    execute format('create policy %I on storage.objects for delete using (bucket_id = %L and owner = auth.uid())', 'own_del_' || b, b);
  end loop;
end $$;