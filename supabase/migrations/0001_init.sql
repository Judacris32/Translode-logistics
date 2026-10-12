-- Translode Logistics: core schema
-- Run this once in Supabase > SQL Editor, then run supabase/seed.sql for sample data.
--
-- Conventions
--   * Money is stored in kobo as bigint. 100 kobo = 1 naira. No floats.
--   * Weight is stored in grams as integer.
--   * Row level security is on for every table. Signed-out visitors can do
--     exactly two things: look up one waybill through track_shipment(), and
--     send a quote request.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('customer', 'driver', 'dispatcher', 'admin');
create type public.service_type as enum ('courier', 'haulage', 'freight');
create type public.hub_kind as enum ('depot', 'port', 'airport');
create type public.quote_status as enum ('new', 'contacted', 'converted', 'closed');
create type public.shipment_status as enum (
  'booked',
  'picked_up',
  'at_origin_hub',
  'in_transit',
  'customs',
  'at_destination_hub',
  'out_for_delivery',
  'delivered',
  'exception',
  'cancelled'
);

-- ---------------------------------------------------------------------------
-- Profiles: one row per signed-up user
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  company text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Role checks run as the function owner so they can read profiles without
-- tripping the policies that call them.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('dispatcher', 'admin')
  );
$$;

-- Every new sign-up gets a customer profile. Staff roles are granted by an admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Nobody promotes themselves. Only an admin, or SQL run from the dashboard
-- (where auth.uid() is null), can change a role.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only an admin can change a role.';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------------------
-- Hubs: depots, the port desk and the airport desk
-- ---------------------------------------------------------------------------

create table public.hubs (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  city text not null,
  state text not null,
  kind public.hub_kind not null default 'depot',
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Shipments
-- ---------------------------------------------------------------------------

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique,
  service public.service_type not null,
  status public.shipment_status not null default 'booked',

  customer_id uuid references public.profiles (id) on delete set null,
  driver_id uuid references public.profiles (id) on delete set null,
  current_hub_id uuid references public.hubs (id) on delete set null,

  sender_name text not null,
  sender_phone text not null,
  origin_city text not null,
  origin_address text not null,

  receiver_name text not null,
  receiver_phone text not null,
  destination_city text not null,
  destination_address text not null,
  destination_country text not null default 'Nigeria',

  description text not null,
  pieces integer not null default 1 check (pieces > 0),
  weight_grams integer not null check (weight_grams > 0),
  truck_size text check (truck_size in ('5t', '15t', '30t')),
  declared_value_kobo bigint not null default 0 check (declared_value_kobo >= 0),
  price_kobo bigint not null check (price_kobo >= 0),
  paid boolean not null default false,

  eta timestamptz,
  delivered_at timestamptz,
  signed_by text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shipments_customer_idx on public.shipments (customer_id);
create index shipments_driver_idx on public.shipments (driver_id);
create index shipments_status_idx on public.shipments (status);
create index shipments_created_idx on public.shipments (created_at desc);

-- Waybill numbers look like TRL-CR-20418836: brand, service, eight digits.
create or replace function public.generate_tracking_number(p_service public.service_type)
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_code text := case p_service when 'courier' then 'CR' when 'haulage' then 'HL' else 'FR' end;
  v_candidate text;
begin
  loop
    v_candidate := 'TRL-' || v_code || '-' || lpad((floor(random() * 100000000))::bigint::text, 8, '0');
    exit when not exists (select 1 from public.shipments where tracking_number = v_candidate);
  end loop;
  return v_candidate;
end;
$$;

create or replace function public.shipments_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.tracking_number is null or new.tracking_number = '' then
    new.tracking_number := public.generate_tracking_number(new.service);
  end if;
  return new;
end;
$$;

create trigger shipments_set_tracking_number
  before insert on public.shipments
  for each row execute function public.shipments_before_insert();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger shipments_touch
  before update on public.shipments
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Tracking events: one row per scan
-- ---------------------------------------------------------------------------

create table public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments (id) on delete cascade,
  status public.shipment_status not null,
  hub_id uuid references public.hubs (id) on delete set null,
  location text not null,
  note text,
  occurred_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index tracking_events_shipment_idx on public.tracking_events (shipment_id, occurred_at desc);

-- The newest scan decides the shipment's status. A scan entered late, with an
-- older time, is kept in the history but does not move the shipment backwards.
create or replace function public.apply_tracking_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.tracking_events
    where shipment_id = new.shipment_id and occurred_at > new.occurred_at
  ) then
    update public.shipments
    set status = new.status,
        current_hub_id = new.hub_id,
        delivered_at = case when new.status = 'delivered' then new.occurred_at else delivered_at end
    where id = new.shipment_id;
  end if;
  return new;
end;
$$;

create trigger tracking_events_apply
  after insert on public.tracking_events
  for each row execute function public.apply_tracking_event();

-- ---------------------------------------------------------------------------
-- Quote requests from the website
-- ---------------------------------------------------------------------------

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  service public.service_type not null,
  origin_city text not null,
  destination_city text not null,
  weight_grams integer check (weight_grams is null or weight_grams > 0),
  truck_size text check (truck_size in ('5t', '15t', '30t')),
  estimate_kobo bigint not null check (estimate_kobo >= 0),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 30),
  email text check (email is null or char_length(email) <= 160),
  notes text check (notes is null or char_length(notes) <= 1000),
  status public.quote_status not null default 'new',
  handled_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index quote_requests_status_idx on public.quote_requests (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Public tracking
-- ---------------------------------------------------------------------------

-- The only way a signed-out visitor can read a shipment. It returns the
-- receiver's first name and the cities, never phone numbers, street
-- addresses, prices or who paid.
create or replace function public.track_shipment(p_tracking text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'trackingNumber', s.tracking_number,
    'service', s.service,
    'status', s.status,
    'originCity', s.origin_city,
    'destinationCity', s.destination_city,
    'destinationCountry', s.destination_country,
    'receiverFirstName', split_part(s.receiver_name, ' ', 1),
    'description', s.description,
    'pieces', s.pieces,
    'weightKg', round(s.weight_grams / 1000.0, 1),
    'bookedAt', s.created_at,
    'eta', case when s.status in ('delivered', 'cancelled') then null else s.eta end,
    'deliveredAt', s.delivered_at,
    'signedBy', s.signed_by,
    'events', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'status', e.status,
            'location', e.location,
            'note', e.note,
            'occurredAt', e.occurred_at,
            'lat', h.lat,
            'lng', h.lng
          )
          order by e.occurred_at desc
        )
        from public.tracking_events e
        left join public.hubs h on h.id = e.hub_id
        where e.shipment_id = s.id
      ),
      '[]'::jsonb
    )
  )
  from public.shipments s
  where s.tracking_number = upper(trim(p_tracking));
$$;

revoke all on function public.track_shipment(text) from public;
grant execute on function public.track_shipment(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.hubs enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.quote_requests enable row level security;

-- Profiles: you see and edit your own. Staff see everyone. Admins edit anyone.
create policy "profiles: read own or staff"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: admin updates anyone"
  on public.profiles for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Hubs: public information. Only admins change it.
create policy "hubs: anyone reads"
  on public.hubs for select to anon, authenticated
  using (true);

create policy "hubs: admin writes"
  on public.hubs for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Shipments: customers see their own, drivers see the ones assigned to them,
-- staff see and manage all of them.
create policy "shipments: read own, assigned or staff"
  on public.shipments for select to authenticated
  using (customer_id = auth.uid() or driver_id = auth.uid() or public.is_staff());

create policy "shipments: staff create"
  on public.shipments for insert to authenticated
  with check (public.is_staff());

create policy "shipments: staff update"
  on public.shipments for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "shipments: admin delete"
  on public.shipments for delete to authenticated
  using (public.is_admin());

-- Tracking events: visible to whoever can see the shipment. Staff scan
-- anything; a driver scans only the shipments assigned to him.
create policy "events: read with shipment"
  on public.tracking_events for select to authenticated
  using (
    exists (
      select 1 from public.shipments s
      where s.id = shipment_id
        and (s.customer_id = auth.uid() or s.driver_id = auth.uid() or public.is_staff())
    )
  );

create policy "events: staff or assigned driver scan"
  on public.tracking_events for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      public.is_staff()
      or exists (select 1 from public.shipments s where s.id = shipment_id and s.driver_id = auth.uid())
    )
  );

create policy "events: admin corrects"
  on public.tracking_events for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "events: admin deletes"
  on public.tracking_events for delete to authenticated
  using (public.is_admin());

-- Quote requests: anyone can send one. Only staff read and work them.
create policy "quotes: anyone sends"
  on public.quote_requests for insert to anon, authenticated
  with check (status = 'new' and handled_by is null);

create policy "quotes: staff read"
  on public.quote_requests for select to authenticated
  using (public.is_staff());

create policy "quotes: staff update"
  on public.quote_requests for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
