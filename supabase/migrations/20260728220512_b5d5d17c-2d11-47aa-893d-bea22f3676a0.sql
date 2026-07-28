-- Allow anon RSVP inserts on public/unlisted events
GRANT INSERT ON public.guests TO anon;

CREATE POLICY "Anon can RSVP to public or unlisted events"
ON public.guests
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id
      AND e.visibility IN ('public','unlisted')
  )
);

-- Also allow authenticated users to RSVP as guests to public/unlisted events
CREATE POLICY "Authenticated can RSVP to public or unlisted events"
ON public.guests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id
      AND e.visibility IN ('public','unlisted')
  )
);

-- Expose unlisted events by slug (needed for the RSVP page)
GRANT SELECT ON public.events TO anon;

CREATE POLICY "Public can view unlisted events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (visibility IN ('public','unlisted') OR is_demo);

CREATE INDEX IF NOT EXISTS guests_event_email_idx ON public.guests (event_id, email);