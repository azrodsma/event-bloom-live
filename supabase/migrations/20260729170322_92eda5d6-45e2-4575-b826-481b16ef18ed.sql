CREATE OR REPLACE FUNCTION private.can_view_event(_event_id uuid, _user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = _event_id
      AND (
        e.is_demo
        OR e.visibility = 'public'
        OR e.owner_id = _user_id
        OR private.is_event_member(_event_id, _user_id)
      )
  );
$function$;