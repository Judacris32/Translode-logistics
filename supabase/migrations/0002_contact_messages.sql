-- Translode Logistics: messages from the contact form
-- Run after 0001_init.sql.

create type public.message_status as enum ('new', 'answered', 'closed');

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (topic in ('general', 'shipment', 'sea', 'warehousing', 'account')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 30),
  email text check (email is null or char_length(email) <= 160),
  waybill text check (waybill is null or char_length(waybill) <= 20),
  message text not null check (char_length(message) between 10 and 2000),
  status public.message_status not null default 'new',
  handled_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index contact_messages_status_idx on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;

-- Anyone can send a message. Only staff read and answer them.
create policy "messages: anyone sends"
  on public.contact_messages for insert to anon, authenticated
  with check (status = 'new' and handled_by is null);

create policy "messages: staff read"
  on public.contact_messages for select to authenticated
  using (public.is_staff());

create policy "messages: staff update"
  on public.contact_messages for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
