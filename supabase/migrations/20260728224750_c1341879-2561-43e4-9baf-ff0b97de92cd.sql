
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS invite_token uuid UNIQUE DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz;

UPDATE public.guests SET invite_token = gen_random_uuid() WHERE invite_token IS NULL;

CREATE INDEX IF NOT EXISTS guests_invite_token_idx ON public.guests(invite_token);
