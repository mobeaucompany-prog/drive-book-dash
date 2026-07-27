create extension if not exists pgcrypto;

create table if not exists public.workshop_reservations (
  id uuid primary key default gen_random_uuid(),
  equipment_id text not null check (equipment_id in ('pont', 'pneus', 'fosse', 'presse')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  vehicle text not null,
  description text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'expired')),
  approval_token_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists public.workshop_reservation_slots (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.workshop_reservations(id) on delete cascade,
  equipment_id text not null check (equipment_id in ('pont', 'pneus', 'fosse', 'presse')),
  slot_start timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'expired')),
  created_at timestamptz not null default now()
);

create unique index if not exists workshop_active_slot_unique
  on public.workshop_reservation_slots (equipment_id, slot_start)
  where status in ('pending', 'confirmed');

create index if not exists workshop_slots_calendar_idx
  on public.workshop_reservation_slots (equipment_id, slot_start, status);

alter table public.workshop_reservations enable row level security;
alter table public.workshop_reservation_slots enable row level security;

create or replace function public.cleanup_expired_workshop_reservations()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.workshop_reservations
  set status = 'expired', decided_at = now()
  where status = 'pending' and expires_at < now();

  update public.workshop_reservation_slots s
  set status = 'expired'
  from public.workshop_reservations r
  where s.reservation_id = r.id
    and s.status = 'pending'
    and r.status = 'expired';
end;
$$;

create or replace function public.create_workshop_reservation(
  p_equipment_id text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_vehicle text,
  p_description text,
  p_token_hash text,
  p_slots timestamptz[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_slot timestamptz;
begin
  perform public.cleanup_expired_workshop_reservations();

  if p_equipment_id not in ('pont', 'pneus', 'fosse', 'presse') then
    raise exception 'Équipement invalide';
  end if;

  if cardinality(p_slots) < 1 or cardinality(p_slots) > 24 then
    raise exception 'Nombre de créneaux invalide';
  end if;

  if exists (
    select 1
    from unnest(p_slots) slot
    where slot < now()
  ) then
    raise exception 'Un créneau sélectionné est déjà passé';
  end if;

  insert into public.workshop_reservations (
    equipment_id,
    customer_name,
    customer_email,
    customer_phone,
    vehicle,
    description,
    approval_token_hash
  )
  values (
    p_equipment_id,
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    trim(p_customer_phone),
    trim(p_vehicle),
    trim(p_description),
    p_token_hash
  )
  returning id into v_id;

  foreach v_slot in array p_slots loop
    insert into public.workshop_reservation_slots (
      reservation_id,
      equipment_id,
      slot_start
    )
    values (v_id, p_equipment_id, v_slot);
  end loop;

  return v_id;
end;
$$;

create or replace function public.decide_workshop_reservation(
  p_token_hash text,
  p_decision text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reservation public.workshop_reservations%rowtype;
  v_new_status text;
  v_result jsonb;
begin
  perform public.cleanup_expired_workshop_reservations();

  select *
  into v_reservation
  from public.workshop_reservations
  where approval_token_hash = p_token_hash
  for update;

  if not found then
    raise exception 'Lien de réservation invalide';
  end if;

  if v_reservation.status <> 'pending' then
    raise exception 'Cette demande a déjà été traitée';
  end if;

  if p_decision = 'confirm' then
    v_new_status := 'confirmed';
  elsif p_decision = 'reject' then
    v_new_status := 'rejected';
  else
    raise exception 'Décision invalide';
  end if;

  update public.workshop_reservations
  set status = v_new_status, decided_at = now()
  where id = v_reservation.id;

  update public.workshop_reservation_slots
  set status = v_new_status
  where reservation_id = v_reservation.id;

  select jsonb_build_object(
    'id', r.id,
    'equipment_id', r.equipment_id,
    'customer_name', r.customer_name,
    'customer_email', r.customer_email,
    'customer_phone', r.customer_phone,
    'vehicle', r.vehicle,
    'description', r.description,
    'status', r.status,
    'slots', coalesce(
      (
        select jsonb_agg(s.slot_start order by s.slot_start)
        from public.workshop_reservation_slots s
        where s.reservation_id = r.id
      ),
      '[]'::jsonb
    )
  )
  into v_result
  from public.workshop_reservations r
  where r.id = v_reservation.id;

  return v_result;
end;
$$;

revoke all on function public.cleanup_expired_workshop_reservations() from public, anon, authenticated;
revoke all on function public.create_workshop_reservation(text, text, text, text, text, text, text, timestamptz[]) from public, anon, authenticated;
revoke all on function public.decide_workshop_reservation(text, text) from public, anon, authenticated;

grant execute on function public.cleanup_expired_workshop_reservations() to service_role;
grant execute on function public.create_workshop_reservation(text, text, text, text, text, text, text, timestamptz[]) to service_role;
grant execute on function public.decide_workshop_reservation(text, text) to service_role;
