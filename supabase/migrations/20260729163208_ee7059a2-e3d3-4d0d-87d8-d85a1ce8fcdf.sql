
-- Public SECURITY INVOKER wrapper so the app's supabase.rpc('is_event_organizer', ...)
-- keeps working. The privileged logic lives in private.is_event_organizer.
CREATE OR REPLACE FUNCTION public.is_event_organizer(_event_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.is_event_organizer(_event_id, _user_id);
$$;

GRANT EXECUTE ON FUNCTION public.is_event_organizer(uuid, uuid) TO anon, authenticated, service_role;
