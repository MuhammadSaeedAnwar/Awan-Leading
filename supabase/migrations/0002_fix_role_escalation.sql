-- ═══════════════════════════════════════════════════════════════════
-- Security fix: the profiles UPDATE policy allowed a signed-in user to
-- edit their OWN row, and the "role" column was writable through that
-- same policy — letting any customer PATCH their own profile to set
-- role = 'admin' and self-escalate privileges.
--
-- Fix: a trigger that silently pins `role` back to its previous value
-- on any UPDATE performed by a non-admin, regardless of what the
-- client sends. Only an admin (via public.is_admin()) can change role.
-- ═══════════════════════════════════════════════════════════════════

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only clamp the role when a logged-in user (via the public API, with
  -- their own JWT) is making the change and isn't an admin. Direct
  -- database access (SQL editor, service_role, migrations) has no
  -- auth.uid() and is left free to bootstrap the first admin account.
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    new.role = old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();
