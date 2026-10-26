-- Private, shared stock. Existing garage administrators retain their access.
create or replace function public.is_stock_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select auth.uid() is not null and exists (
  select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'
); $$;
revoke all on function public.is_stock_admin() from public, anon;
grant execute on function public.is_stock_admin() to authenticated;

create table public.tyre_stock (
  id uuid primary key default gen_random_uuid(),
  season text not null check (season in ('summer','winter','all_season')),
  width integer not null check (width between 125 and 355 and width % 5 = 0),
  aspect_ratio integer not null check (aspect_ratio between 20 and 85 and aspect_ratio % 5 = 0),
  diameter integer not null check (diameter between 13 and 23),
  brand text not null check (length(trim(brand)) between 1 and 80),
  model text not null check (length(trim(model)) between 1 and 100),
  tyre_year integer not null check (tyre_year between 1980 and 2100),
  pairs integer not null default 0 check (pairs between 0 and 100000),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
create unique index tyre_stock_active_reference on public.tyre_stock
  (season, width, aspect_ratio, diameter, lower(trim(brand)), lower(trim(model)), tyre_year)
  where archived_at is null;
create index tyre_stock_filters on public.tyre_stock (diameter, season) where archived_at is null;

create table public.tyre_stock_movements (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.tyre_stock(id),
  actor_id uuid not null references auth.users(id),
  action text not null check (action in ('add','adjust','edit','archive')),
  delta integer not null,
  balance integer not null check (balance >= 0),
  reason text not null default '' check (length(reason) <= 300),
  reference jsonb not null,
  created_at timestamptz not null default now()
);
create index tyre_stock_movements_recent on public.tyre_stock_movements (created_at desc);
-- Idempotency: retrying a request after a dropped connection cannot change stock twice.
create table public.tyre_stock_requests (
  request_id uuid primary key,
  actor_id uuid not null references auth.users(id),
  payload jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.tyre_stock enable row level security;
alter table public.tyre_stock_movements enable row level security;
alter table public.tyre_stock_requests enable row level security;
revoke all on public.tyre_stock, public.tyre_stock_movements, public.tyre_stock_requests from public, anon, authenticated;
grant select on public.tyre_stock, public.tyre_stock_movements to authenticated;
create policy "Only garage administrators can read stock" on public.tyre_stock for select to authenticated using (public.is_stock_admin());
create policy "Only garage administrators can read movements" on public.tyre_stock_movements for select to authenticated using (public.is_stock_admin());

create or replace function public.mutate_tyre_stock(p_request_id uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  v_action text := p_payload->>'action';
  v_row public.tyre_stock;
  v_previous public.tyre_stock_requests;
  v_delta integer := 0;
  v_reason text := trim(coalesce(p_payload->>'reason',''));
  v_result jsonb;
begin
  if not public.is_stock_admin() then raise exception 'STOCK_FORBIDDEN'; end if;
  if p_request_id is null or p_payload is null then raise exception 'STOCK_INVALID'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_previous from public.tyre_stock_requests where request_id = p_request_id;
  if found then
    if v_previous.actor_id <> auth.uid() or v_previous.payload <> p_payload then raise exception 'STOCK_REQUEST_CONFLICT'; end if;
    return v_previous.result;
  end if;
  if length(v_reason) > 300 then raise exception 'STOCK_INVALID'; end if;
  if v_action in ('add','edit') then
    if (p_payload->>'tyre_year')::integer > extract(year from current_date)::integer then raise exception 'STOCK_YEAR'; end if;
  end if;
  if v_action = 'add' then
    v_delta := (p_payload->>'pairs')::integer;
    if v_delta is null or v_delta < 1 or v_delta > 10000 then raise exception 'STOCK_INVALID'; end if;
    insert into public.tyre_stock(season,width,aspect_ratio,diameter,brand,model,tyre_year,pairs)
    values(p_payload->>'season',(p_payload->>'width')::integer,(p_payload->>'aspect_ratio')::integer,
      (p_payload->>'diameter')::integer,trim(p_payload->>'brand'),trim(p_payload->>'model'),(p_payload->>'tyre_year')::integer,v_delta)
    on conflict (season,width,aspect_ratio,diameter,lower(trim(brand)),lower(trim(model)),tyre_year) where archived_at is null
    do update set pairs = tyre_stock.pairs + excluded.pairs, version = tyre_stock.version + 1, updated_at = now()
    returning * into v_row;
  elsif v_action in ('adjust','edit','archive') then
    select * into v_row from public.tyre_stock where id = (p_payload->>'id')::uuid and archived_at is null for update;
    if not found then raise exception 'STOCK_NOT_FOUND'; end if;
    if v_action = 'adjust' then
      v_delta := (p_payload->>'delta')::integer;
      if v_delta is null or v_delta = 0 or abs(v_delta::bigint) > 10000 then raise exception 'STOCK_INVALID'; end if;
      if v_row.pairs + v_delta < 0 then raise exception 'STOCK_INSUFFICIENT'; end if;
      update public.tyre_stock set pairs = pairs + v_delta, version = version + 1, updated_at = now() where id = v_row.id returning * into v_row;
    else
      if (p_payload->>'version')::integer is distinct from v_row.version then raise exception 'STOCK_CONFLICT'; end if;
      if v_action = 'archive' then
        if v_row.pairs <> 0 then raise exception 'STOCK_NOT_EMPTY'; end if;
        update public.tyre_stock set archived_at = now(), updated_at = now(), version = version + 1 where id = v_row.id returning * into v_row;
      else
        update public.tyre_stock set season = p_payload->>'season',width = (p_payload->>'width')::integer,
          aspect_ratio = (p_payload->>'aspect_ratio')::integer,diameter = (p_payload->>'diameter')::integer,
          brand = trim(p_payload->>'brand'),model = trim(p_payload->>'model'),tyre_year = (p_payload->>'tyre_year')::integer,
          version = version + 1,updated_at = now() where id = v_row.id returning * into v_row;
      end if;
    end if;
  else raise exception 'STOCK_INVALID';
  end if;
  v_result := to_jsonb(v_row);
  insert into public.tyre_stock_movements(stock_id,actor_id,action,delta,balance,reason,reference)
    values(v_row.id,auth.uid(),v_action,v_delta,v_row.pairs,v_reason,v_result);
  insert into public.tyre_stock_requests(request_id,actor_id,payload,result) values(p_request_id,auth.uid(),p_payload,v_result);
  return v_result;
end; $$;
revoke all on function public.mutate_tyre_stock(uuid,jsonb) from public, anon;
grant execute on function public.mutate_tyre_stock(uuid,jsonb) to authenticated;
