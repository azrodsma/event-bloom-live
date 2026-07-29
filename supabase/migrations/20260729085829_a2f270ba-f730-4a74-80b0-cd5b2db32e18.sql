CREATE OR REPLACE FUNCTION public.notify_guestbook_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_title text;
BEGIN
  SELECT owner_id, title INTO v_owner, v_title FROM public.events WHERE id = NEW.event_id;
  IF v_owner IS NULL OR v_owner = NEW.author_id THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.notifications (user_id, event_id, type, title, body, link)
  VALUES (
    v_owner,
    NEW.event_id,
    'guestbook',
    'Nouveau message dans le livre d''or',
    COALESCE(NEW.author_name || ' : ', '') || COALESCE(LEFT(NEW.content, 140), '📸 souvenir partagé'),
    '/events/' || (SELECT slug FROM public.events WHERE id = NEW.event_id) || '/guestbook'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_guestbook_owner ON public.guestbook_entries;
CREATE TRIGGER trg_notify_guestbook_owner
AFTER INSERT ON public.guestbook_entries
FOR EACH ROW EXECUTE FUNCTION public.notify_guestbook_owner();

CREATE OR REPLACE FUNCTION public.notify_rsvp_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_slug text;
BEGIN
  IF NEW.rsvp = OLD.rsvp THEN
    RETURN NEW;
  END IF;
  IF NEW.rsvp NOT IN ('confirmed','declined','maybe') THEN
    RETURN NEW;
  END IF;
  SELECT owner_id, slug INTO v_owner, v_slug FROM public.events WHERE id = NEW.event_id;
  IF v_owner IS NULL THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.notifications (user_id, event_id, type, title, body, link)
  VALUES (
    v_owner,
    NEW.event_id,
    'rsvp',
    'Nouvelle réponse RSVP',
    NEW.full_name || ' a répondu : ' ||
      CASE NEW.rsvp
        WHEN 'confirmed' THEN 'Présent·e ✨'
        WHEN 'declined' THEN 'Absent·e'
        ELSE 'Peut-être'
      END,
    '/events/' || v_slug || '/guests'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_rsvp_owner ON public.guests;
CREATE TRIGGER trg_notify_rsvp_owner
AFTER UPDATE OF rsvp ON public.guests
FOR EACH ROW EXECUTE FUNCTION public.notify_rsvp_owner();