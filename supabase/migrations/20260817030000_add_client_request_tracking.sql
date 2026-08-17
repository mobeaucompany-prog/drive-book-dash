-- Client request tracking and garage quote responses.

alter table public.quote_requests
  add column if not exists quoted_amount numeric(10, 2),
  add column if not exists admin_response text,
  add column if not exists responded_at timestamptz,
  add column if not exists responded_by uuid references auth.users(id) on delete set null;

alter table public.quote_requests
  drop constraint if exists quote_requests_quoted_amount_check;

alter table public.quote_requests
  add constraint quote_requests_quoted_amount_check
  check (quoted_amount is null or quoted_amount >= 0);

create index if not exists workshop_reservations_customer_email_idx
  on public.workshop_reservations (lower(customer_email), created_at desc);

create index if not exists quote_requests_customer_email_idx
  on public.quote_requests (lower(customer_email), created_at desc);

create or replace function public.admin_update_quote_request(
  p_quote_id uuid,
  p_status text,
  p_admin_response text default null,
  p_quoted_amount numeric default null,
  p_responded_by uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  if p_status not in ('new', 'contacted', 'quoted', 'closed') then
    raise exception 'Statut de devis invalide';
  end if;

  if p_status = 'quoted' and trim(coalesce(p_admin_response, '')) = '' then
    raise exception 'Une réponse est obligatoire pour envoyer un devis';
  end if;

  if p_quoted_amount is not null and p_quoted_amount < 0 then
    raise exception 'Montant invalide';
  end if;

  update public.quote_requests
  set
    status = p_status,
    admin_response = nullif(trim(coalesce(p_admin_response, '')), ''),
    quoted_amount = p_quoted_amount,
    responded_at = now(),
    responded_by = p_responded_by
  where id = p_quote_id;

  if not found then
    raise exception 'Demande de devis introuvable';
  end if;

  select to_jsonb(q)
  into v_result
  from public.quote_requests q
  where q.id = p_quote_id;

  return v_result;
end;
$$;

revoke all on function public.admin_update_quote_request(uuid, text, text, numeric, uuid)
  from public, anon, authenticated;
grant execute on function public.admin_update_quote_request(uuid, text, text, numeric, uuid)
  to service_role;
