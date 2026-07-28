
-- Storage: allow authenticated users to upload into event-media, and read
CREATE POLICY "event-media authenticated upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-media');

CREATE POLICY "event-media authenticated read"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'event-media');

CREATE POLICY "event-media anon read"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'event-media');

CREATE POLICY "event-media owner delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'event-media' AND owner = auth.uid());

-- Realtime for guestbook + album
ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.album_media;
