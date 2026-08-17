-- Secure manual workshop blocking and admin decisions.
-- Apply this migration after 20260728010000_create_workshop_reservations.sql.

alter table public.workshop_reservation_slots
  alter column reservation_id drop not null;

alter table public.workshop_reservation_slots
  add column if not exists block_group_id uuid,
  add column if not exists blocked_reason text,
  add column if not exists blocked_by uuid,
  add column if not exists blocked_at timestamptz;

alter table public.workshop_reservation_slots
  drop constraint if exists workshop_reservation_slots_status_check;

alter table public.workshop_reservation_slots
  add constraint workshop_reservation_slots_status_check
  check (status in ('pending', 'confirmed', 'rejected', 'expired', 'blocked'));

drop index if exists public.workshop_active_slot_unique;

create unique index workshop_active_slot_unique
  on public.workshop_reservation_slots (equipment_id, slot_start)
  where status in ('pending', 'confirmed', 'blocked');

create index if not exists workshop_block_group_idx
  on public.workshop_reservation_slots (block_group_id)
  where status = 'blocked';

create or replace function public.create_workshop_block(
  p_equipment_id text,
  p_slots timestamptz[],
  p_reason text,
  p_blocked_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid := gen_random_uuid();
  v_slot timestamptz;
begin
  perform public.cleanup_expired_workshop_reservations();

  if p_equipment_id not in ('pont', 'pneus', 'fosse', 'presse') then
    raise exception 'Équipement invalide';
  end if;

  if cardinality(p_slots) < 1 or cardinality(p_slots) > 48 then
    raise exception 'Nombre de créneaux invalide';
  end if;

  if trim(coalesce(p_reason, '')) = '' then
    raise exception 'Motif obligatoire';
  end if;

  if exists (
    select 1
    from unnest(p_slots) slot
    where slot < now()
  ) then
    raise exception 'Un créneau sélectionné est déjà passé';
  end if;

  foreach v_slot in array p_slots loop
    insert into public.workshop_reservation_slots (
      reservation_id,
      equipment_id,
      slot_start,
      status,
      block_group_id,
      blocked_reason,
      blocked_by,
      blocked_at
    )
    values (
      null,
      p_equipment_id,
      v_slot,
      'blocked',
      v_group_id,
      trim(p_reason),
      p_blocked_by,
      now()
    );
  end loop;

  return v_group_id;
end;
$$;

create or replace function public.delete_workshop_block_group(
  p_block_group_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.workshop_reservation_slots
  where block_group_id = p_block_group_id
    and status = 'blocked';

  if not found then
    raise exception 'Blocage introuvable';
  end if;
end;
$$;

create or replace function public.admin_decide_workshop_reservation(
  p_reservation_id uuid,
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
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Demande introuvable';
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

revoke all on function public.create_workshop_block(text, timestamptz[], text, uuid) from public, anon, authenticated;
revoke all on function public.delete_workshop_block_group(uuid) from public, anon, authenticated;
revoke all on function public.admin_decide_workshop_reservation(uuid, text) from public, anon, authenticated;

grant execute on function public.create_workshop_block(text, timestamptz[], text, uuid) to service_role;
grant execute on function public.delete_workshop_block_group(uuid) to service_role;
grant execute on function public.admin_decide_workshop_reservation(uuid, text) to service_role;
