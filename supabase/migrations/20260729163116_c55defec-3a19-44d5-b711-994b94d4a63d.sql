
-- =========================================================
-- 1. Move SECURITY DEFINER helpers out of exposed `public` schema
-- =========================================================
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_event_member(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.is_event_organizer(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.can_view_event(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.is_conversation_member(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.handle_new_user() SET SCHEMA private;
ALTER FUNCTION public.notify_dm_recipients() SET SCHEMA private;
ALTER FUNCTION public.notify_guestbook_owner() SET SCHEMA private;
ALTER FUNCTION public.notify_rsvp_owner() SET SCHEMA private;

-- Ensure execute grants still work for RLS callers
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_event_member(uuid, uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_event_organizer(uuid, uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_view_event(uuid, uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_conversation_member(uuid, uuid) TO anon, authenticated, service_role;

-- Recreate triggers that reference the moved trigger functions (schema-qualify them)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

DROP TRIGGER IF EXISTS trg_notify_dm_recipients ON public.direct_messages;
CREATE TRIGGER trg_notify_dm_recipients AFTER INSERT ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION private.notify_dm_recipients();

DROP TRIGGER IF EXISTS trg_notify_guestbook_owner ON public.guestbook_entries;
CREATE TRIGGER trg_notify_guestbook_owner AFTER INSERT ON public.guestbook_entries
  FOR EACH ROW EXECUTE FUNCTION private.notify_guestbook_owner();

DROP TRIGGER IF EXISTS trg_notify_rsvp_owner ON public.guests;
CREATE TRIGGER trg_notify_rsvp_owner AFTER UPDATE OF rsvp ON public.guests
  FOR EACH ROW EXECUTE FUNCTION private.notify_rsvp_owner();

-- =========================================================
-- 2. comments — require event view access
-- =========================================================
DROP POLICY IF EXISTS "comments view" ON public.comments;
CREATE POLICY "comments view" ON public.comments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = comments.post_id
      AND private.can_view_event(p.event_id, auth.uid())
  )
);

-- =========================================================
-- 3. post_likes — require event view access
-- =========================================================
DROP POLICY IF EXISTS "likes view" ON public.post_likes;
CREATE POLICY "likes view" ON public.post_likes FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = post_likes.post_id
      AND private.can_view_event(p.event_id, auth.uid())
  )
);

-- =========================================================
-- 4. profiles — remove public read; authenticated only
-- =========================================================
DROP POLICY IF EXISTS "profiles readable" ON public.profiles;
CREATE POLICY "profiles readable to authenticated" ON public.profiles FOR SELECT TO authenticated
USING (true);
REVOKE SELECT ON public.profiles FROM anon;

-- =========================================================
-- 5. guests — remove demo bypass, keep only organizer read
-- =========================================================
DROP POLICY IF EXISTS "guests view demo or organizer" ON public.guests;
CREATE POLICY "guests view organizer" ON public.guests FOR SELECT TO authenticated
USING (private.is_event_organizer(event_id, auth.uid()));

-- =========================================================
-- 6. guests — remove anonymous RSVP insert
-- =========================================================
DROP POLICY IF EXISTS "Anon can RSVP to public or unlisted events" ON public.guests;
REVOKE INSERT ON public.guests FROM anon;

-- =========================================================
-- 7. storage.objects — event-media access must check event access
-- =========================================================
DROP POLICY IF EXISTS "event-media anon read" ON storage.objects;
DROP POLICY IF EXISTS "event-media authenticated read" ON storage.objects;
DROP POLICY IF EXISTS "event-media authenticated upload" ON storage.objects;

-- Read: file owner OR requester can view the event derived from path
-- Path conventions used by the app:
--   <eventId>/<userId>/<file>          (uploadEventMedia)
--   guestbook/<eventId>/<file>         (guestbook upload)
CREATE POLICY "event-media view for members" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'event-media'
  AND (
    owner = auth.uid()
    OR (
      split_part(name, '/', 1) ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      AND private.can_view_event((split_part(name, '/', 1))::uuid, auth.uid())
    )
    OR (
      split_part(name, '/', 1) = 'guestbook'
      AND split_part(name, '/', 2) ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      AND private.can_view_event((split_part(name, '/', 2))::uuid, auth.uid())
    )
  )
);

-- Upload: only if requester can view the target event derived from path
CREATE POLICY "event-media upload for members" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'event-media'
  AND (
    (
      split_part(name, '/', 1) ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      AND private.can_view_event((split_part(name, '/', 1))::uuid, auth.uid())
    )
    OR (
      split_part(name, '/', 1) = 'guestbook'
      AND split_part(name, '/', 2) ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      AND private.can_view_event((split_part(name, '/', 2))::uuid, auth.uid())
    )
  )
);
