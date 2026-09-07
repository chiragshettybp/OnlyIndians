-- OnlyIndians — Public website backend (contact support workflow)
-- Tables: support_tickets, ticket_messages
-- Access: writes only via SECURITY DEFINER RPC submit_contact_ticket (least privilege).

begin;

-- ----------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null default 'General',
  status text not null default 'open' check (status in ('open', 'assigned', 'resolved', 'closed')),
  ip_src text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.support_tickets.email is 'Compulsory contact email (mirrors account email policy).';
comment on column public.support_tickets.phone is 'Optional +91 Indian mobile, validated server-side.';
comment on column public.support_tickets.status is 'open | assigned | resolved | closed';

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  author_email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

comment on table public.ticket_messages is 'Message thread per support ticket; admin replies surface in a later module.';

create index if not exists idx_support_tickets_created_at on public.support_tickets (created_at desc);
create index if not exists idx_support_tickets_status on public.support_tickets (status);
create index if not exists idx_ticket_messages_ticket_id on public.ticket_messages (ticket_id);

-- ----------------------------------------------------------------------
-- RLS: no direct access; writes happen only through the RPC below.
-- ----------------------------------------------------------------------

alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;

revoke all on public.support_tickets from anon, authenticated;
revoke all on public.ticket_messages from anon, authenticated;

-- ----------------------------------------------------------------------
-- submit_contact_ticket — single atomic, validated write for anonymous users.
-- ----------------------------------------------------------------------

create or replace function public.submit_contact_ticket(
  p_name text,
  p_email text,
  p_phone text default null,
  p_subject text default null,
  p_body text default null,
  p_ip text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket_id uuid;
begin
  p_name := trim(p_name);
  p_email := lower(trim(p_email));
  p_subject := nullif(trim(coalesce(p_subject, '')), '');
  p_body := trim(p_body);
  p_phone := nullif(trim(coalesce(p_phone, '')), '');

  if p_name is null or length(p_name) < 2 or length(p_name) > 120 then
    raise exception 'INVALID_NAME';
  end if;

  if p_email is null or p_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' then
    raise exception 'INVALID_EMAIL';
  end if;

  if p_body is null or length(p_body) < 10 or length(p_body) > 4000 then
    raise exception 'INVALID_BODY';
  end if;

  if p_phone is not null and p_phone !~ '^\+91[6-9][0-9]{9}$' then
    raise exception 'INVALID_PHONE';
  end if;

  insert into public.support_tickets (name, email, phone, subject, ip_src)
  values (p_name, p_email, p_phone, coalesce(p_subject, 'General'), p_ip)
  returning id into v_ticket_id;

  insert into public.ticket_messages (ticket_id, author_email, body)
  values (v_ticket_id, p_email, p_body);

  return v_ticket_id;
end;
$$;

revoke all on function public.submit_contact_ticket(text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_ticket(text, text, text, text, text, text) to anon, authenticated;

commit;