-- Application roles for the CAO57 administration area.
-- Users may create their own Supabase Auth account, but only the service role
-- can grant or revoke administrator permissions.

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_role'
      and n.nspname = 'public'
  ) then
    create type public.app_role as enum ('admin', 'user');
  end if;
end
$$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index if not exists user_roles_user_id_idx
  on public.user_roles (user_id);

alter table public.user_roles enable row level security;

-- No policy is intentionally created: browser users cannot read or modify roles.
-- Trusted server functions use the service role and bypass RLS.
revoke all on table public.user_roles from public, anon, authenticated;
grant all on table public.user_roles to service_role;

create or replace function public.has_role(
  p_user_id uuid,
  p_role public.app_role
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = p_user_id
      and role = p_role
  );
$$;

revoke all on function public.has_role(uuid, public.app_role)
  from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role)
  to service_role;
