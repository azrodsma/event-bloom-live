CREATE OR REPLACE FUNCTION public.notify_dm_recipients()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, body, link)
  SELECT cm.user_id,
         'message',
         COALESCE(NEW.sender_name, 'Nouveau message'),
         LEFT(NEW.content, 140),
         '/app/messages/' || NEW.conversation_id
  FROM public.conversation_members cm
  WHERE cm.conversation_id = NEW.conversation_id
    AND cm.user_id <> NEW.sender_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_dm_recipients ON public.direct_messages;
CREATE TRIGGER trg_notify_dm_recipients
AFTER INSERT ON public.direct_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_dm_recipients();