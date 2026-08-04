create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  registration_plate text not null,
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year text,
  mileage integer not null check (mileage >= 0),
  fuel_type text,
  transmission text,
  intervention_type text not null,
  description text not null,
  preferred_dates date[] not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);

alter table public.quote_requests enable row level security;

-- Les demandes sont créées uniquement par le serveur avec la clé service_role.
-- Aucune politique publique n'est volontairement ajoutée.
