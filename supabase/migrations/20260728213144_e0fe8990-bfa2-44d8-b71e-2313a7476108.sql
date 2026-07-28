
-- =========================================================
-- MEMENTO LIVE — Schéma complet
-- =========================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- Helper: updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- ROLES
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles select self" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles readable" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "profiles insert self" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles update self" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile & default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- EVENTS
-- =========================
CREATE TYPE public.event_type AS ENUM ('wedding','baptism','birthday','anniversary','engagement','babyshower','other');
CREATE TYPE public.event_visibility AS ENUM ('private','unlisted','public');
CREATE TYPE public.event_status AS ENUM ('draft','upcoming','live','past','archived');

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  type public.event_type NOT NULL DEFAULT 'other',
  event_date timestamptz,
  location text,
  cover_url text,
  description text,
  cagnotte_url text,
  cagnotte_goal numeric,
  cagnotte_current numeric DEFAULT 0,
  live_url text,
  visibility public.event_visibility NOT NULL DEFAULT 'private',
  status public.event_status NOT NULL DEFAULT 'upcoming',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_owner_idx ON public.events(owner_id);
CREATE INDEX events_slug_idx ON public.events(slug);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- EVENT MEMBERS
-- =========================
CREATE TYPE public.member_role AS ENUM ('owner','coorganizer','guest');

CREATE TABLE public.event_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.member_role NOT NULL DEFAULT 'guest',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
CREATE INDEX event_members_event_idx ON public.event_members(event_id);
CREATE INDEX event_members_user_idx ON public.event_members(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_members TO authenticated;
GRANT ALL ON public.event_members TO service_role;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;

-- Security definer helpers (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_event_member(_event_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.event_members WHERE event_id = _event_id AND user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_event_organizer(_event_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events WHERE id = _event_id AND owner_id = _user_id
    UNION
    SELECT 1 FROM public.event_members WHERE event_id = _event_id AND user_id = _user_id AND role IN ('owner','coorganizer')
  );
$$;

CREATE OR REPLACE FUNCTION public.can_view_event(_event_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = _event_id
      AND (
        e.is_demo
        OR e.visibility = 'public'
        OR e.owner_id = _user_id
        OR public.is_event_member(_event_id, _user_id)
      )
  );
$$;

-- Events policies
CREATE POLICY "events view" ON public.events FOR SELECT USING (
  is_demo OR visibility = 'public' OR owner_id = auth.uid() OR public.is_event_member(id, auth.uid())
);
CREATE POLICY "events insert own" ON public.events FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "events update organizer" ON public.events FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.is_event_organizer(id, auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_event_organizer(id, auth.uid()));
CREATE POLICY "events delete owner" ON public.events FOR DELETE TO authenticated USING (owner_id = auth.uid());

-- Event members policies
CREATE POLICY "members view same event" ON public.event_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_event_organizer(event_id, auth.uid()));
CREATE POLICY "members insert organizer" ON public.event_members FOR INSERT TO authenticated
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()) OR user_id = auth.uid());
CREATE POLICY "members update organizer" ON public.event_members FOR UPDATE TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()));
CREATE POLICY "members delete organizer" ON public.event_members FOR DELETE TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()) OR user_id = auth.uid());

-- =========================
-- GUESTS
-- =========================
CREATE TYPE public.rsvp_status AS ENUM ('pending','confirmed','declined','maybe');

CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  rsvp public.rsvp_status NOT NULL DEFAULT 'pending',
  plus_ones int NOT NULL DEFAULT 0,
  dietary text,
  table_number int,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX guests_event_idx ON public.guests(event_id);
GRANT SELECT ON public.guests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_guests_updated_at BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "guests view demo or organizer" ON public.guests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.is_demo)
  OR public.is_event_organizer(event_id, auth.uid())
);
CREATE POLICY "guests manage organizer" ON public.guests FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

-- =========================
-- POSTS / LIKES / COMMENTS
-- =========================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  author_avatar text,
  content text,
  media_urls text[] DEFAULT '{}',
  media_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_event_idx ON public.posts(event_id, created_at DESC);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts view" ON public.posts FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "posts insert member" ON public.posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND public.can_view_event(event_id, auth.uid()));
CREATE POLICY "posts update own" ON public.posts FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts delete own or organizer" ON public.posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.post_likes (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT ON public.post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes view" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "likes insert self" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "likes delete self" ON public.post_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX comments_post_idx ON public.comments(post_id, created_at);
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments view" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments insert self" ON public.comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "comments delete own" ON public.comments FOR DELETE TO authenticated USING (author_id = auth.uid());

-- =========================
-- STORIES
-- =========================
CREATE TABLE public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  author_avatar text,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);
CREATE INDEX stories_event_idx ON public.stories(event_id, created_at DESC);
GRANT SELECT ON public.stories TO anon;
GRANT SELECT, INSERT, DELETE ON public.stories TO authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stories view" ON public.stories FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "stories insert" ON public.stories FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "stories delete own" ON public.stories FOR DELETE TO authenticated USING (author_id = auth.uid());

-- =========================
-- LIVE CHAT & REACTIONS
-- =========================
CREATE TABLE public.live_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX live_messages_event_idx ON public.live_messages(event_id, created_at);
GRANT SELECT ON public.live_messages TO anon;
GRANT SELECT, INSERT, DELETE ON public.live_messages TO authenticated;
GRANT ALL ON public.live_messages TO service_role;
ALTER TABLE public.live_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "live_msg view" ON public.live_messages FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "live_msg insert" ON public.live_messages FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND public.can_view_event(event_id, auth.uid()));
CREATE POLICY "live_msg delete organizer" ON public.live_messages FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.live_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX live_reactions_event_idx ON public.live_reactions(event_id, created_at DESC);
GRANT SELECT ON public.live_reactions TO anon;
GRANT SELECT, INSERT ON public.live_reactions TO authenticated;
GRANT ALL ON public.live_reactions TO service_role;
ALTER TABLE public.live_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "live_react view" ON public.live_reactions FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "live_react insert" ON public.live_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

-- =========================
-- GUESTBOOK & ALBUM
-- =========================
CREATE TYPE public.guestbook_kind AS ENUM ('text','photo','video','audio');

CREATE TABLE public.guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  kind public.guestbook_kind NOT NULL DEFAULT 'text',
  content text,
  media_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX guestbook_event_idx ON public.guestbook_entries(event_id, created_at DESC);
GRANT SELECT ON public.guestbook_entries TO anon;
GRANT SELECT, INSERT, DELETE ON public.guestbook_entries TO authenticated;
GRANT ALL ON public.guestbook_entries TO service_role;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guestbook view" ON public.guestbook_entries FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "guestbook insert" ON public.guestbook_entries FOR INSERT TO authenticated
  WITH CHECK (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "guestbook delete own or organizer" ON public.guestbook_entries FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.album_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  uploader_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_name text,
  url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX album_event_idx ON public.album_media(event_id, created_at DESC);
GRANT SELECT ON public.album_media TO anon;
GRANT SELECT, INSERT, DELETE ON public.album_media TO authenticated;
GRANT ALL ON public.album_media TO service_role;
ALTER TABLE public.album_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "album view" ON public.album_media FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "album insert" ON public.album_media FOR INSERT TO authenticated
  WITH CHECK (uploader_id = auth.uid() AND public.can_view_event(event_id, auth.uid()));
CREATE POLICY "album delete own or organizer" ON public.album_media FOR DELETE TO authenticated
  USING (uploader_id = auth.uid() OR public.is_event_organizer(event_id, auth.uid()));

-- =========================
-- LOGISTIQUE : Checklist / Budget / Playlist / Gifts / Vendors / Tables / Timeline
-- =========================
CREATE TABLE public.checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  due_date date,
  is_done boolean NOT NULL DEFAULT false,
  assigned_to text,
  position int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.checklist_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklist_items TO authenticated;
GRANT ALL ON public.checklist_items TO service_role;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_checklist_updated_at BEFORE UPDATE ON public.checklist_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "checklist view" ON public.checklist_items FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "checklist manage" ON public.checklist_items FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  label text NOT NULL,
  category text,
  estimated numeric DEFAULT 0,
  actual numeric DEFAULT 0,
  paid boolean NOT NULL DEFAULT false,
  vendor text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.budget_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_items TO authenticated;
GRANT ALL ON public.budget_items TO service_role;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_budget_updated_at BEFORE UPDATE ON public.budget_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "budget view" ON public.budget_items FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "budget manage" ON public.budget_items FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text,
  suggested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  suggested_by_name text,
  votes int NOT NULL DEFAULT 0,
  moment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.playlist_songs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlist_songs TO authenticated;
GRANT ALL ON public.playlist_songs TO service_role;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "playlist view" ON public.playlist_songs FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "playlist insert member" ON public.playlist_songs FOR INSERT TO authenticated
  WITH CHECK (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "playlist manage organizer" ON public.playlist_songs FOR UPDATE TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()) OR suggested_by = auth.uid());
CREATE POLICY "playlist delete organizer" ON public.playlist_songs FOR DELETE TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()) OR suggested_by = auth.uid());

CREATE TABLE public.gift_registry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric,
  image_url text,
  external_url text,
  reserved_by text,
  is_reserved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gift_registry_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_registry_items TO authenticated;
GRANT ALL ON public.gift_registry_items TO service_role;
ALTER TABLE public.gift_registry_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_gift_updated_at BEFORE UPDATE ON public.gift_registry_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "gifts view" ON public.gift_registry_items FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "gifts manage organizer" ON public.gift_registry_items FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  contact_name text,
  contact_email text,
  contact_phone text,
  price numeric,
  status text DEFAULT 'contacted',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "vendors organizer only" ON public.vendors FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.tables_seating (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  table_number int NOT NULL,
  label text,
  capacity int NOT NULL DEFAULT 8,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tables_seating TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tables_seating TO authenticated;
GRANT ALL ON public.tables_seating TO service_role;
ALTER TABLE public.tables_seating ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tables view" ON public.tables_seating FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "tables manage" ON public.tables_seating FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

CREATE TABLE public.timeline_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  time_label text NOT NULL,
  title text NOT NULL,
  description text,
  location text,
  position int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline_items TO authenticated;
GRANT ALL ON public.timeline_items TO service_role;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_timeline_updated_at BEFORE UPDATE ON public.timeline_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "timeline view" ON public.timeline_items FOR SELECT USING (public.can_view_event(event_id, auth.uid()));
CREATE POLICY "timeline manage" ON public.timeline_items FOR ALL TO authenticated
  USING (public.is_event_organizer(event_id, auth.uid()))
  WITH CHECK (public.is_event_organizer(event_id, auth.uid()));

-- =========================
-- NOTIFICATIONS
-- =========================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif view own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif update own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif delete own" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- =========================
-- SEED: DEMO EVENT
-- =========================
DO $$
DECLARE
  demo_event uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
BEGIN
  INSERT INTO public.events (id, owner_id, slug, title, type, event_date, location, cover_url, description, cagnotte_url, cagnotte_goal, cagnotte_current, live_url, visibility, status, is_demo)
  VALUES (
    demo_event, NULL, 'lea-et-jules', 'Léa & Jules', 'wedding',
    now() + interval '30 days', 'Château de Malmaison, Rueil',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    'Le mariage de Léa & Jules — 3 jours de célébration en Île-de-France.',
    'https://www.leetchi.com/c/lea-jules', 4500, 2870,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'public', 'upcoming', true
  );

  INSERT INTO public.posts (event_id, author_name, author_avatar, content, media_urls, media_type) VALUES
    (demo_event, 'Léa', 'https://i.pravatar.cc/100?img=47', 'On y est presque… J-30 ! 💍', ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'], 'image'),
    (demo_event, 'Jules', 'https://i.pravatar.cc/100?img=12', 'Essayage du costume ✔️ Merci Papa 🤍', ARRAY['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800'], 'image'),
    (demo_event, 'Camille', 'https://i.pravatar.cc/100?img=32', 'Bouquet test avec la fleuriste — coup de cœur 🌸', ARRAY['https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800'], 'image');

  INSERT INTO public.comments (post_id, author_name, content)
  SELECT p.id, 'Marc', 'Trop hâte les amis ! ✨' FROM public.posts p WHERE p.event_id = demo_event LIMIT 1;

  INSERT INTO public.guestbook_entries (event_id, author_name, kind, content) VALUES
    (demo_event, 'Mamie Rose', 'text', 'Mes chers petits, que votre amour rayonne toute une vie. Je vous aime.'),
    (demo_event, 'Théo', 'text', 'Vous êtes le plus beau couple qu''on connaisse. Vive les mariés !'),
    (demo_event, 'Chloé & Antoine', 'text', 'Merci de nous faire vivre ce moment avec vous. On vous aime.');

  INSERT INTO public.playlist_songs (event_id, title, artist, suggested_by_name, votes, moment) VALUES
    (demo_event, 'La Vie en Rose', 'Édith Piaf', 'Léa', 24, 'ceremony'),
    (demo_event, 'Perfect', 'Ed Sheeran', 'Jules', 18, 'first_dance'),
    (demo_event, 'September', 'Earth, Wind & Fire', 'Camille', 31, 'party'),
    (demo_event, 'Dernière Danse', 'Indila', 'Théo', 12, 'party');

  INSERT INTO public.checklist_items (event_id, title, category, due_date, is_done, position) VALUES
    (demo_event, 'Envoyer les faire-part', 'Invitations', (now() - interval '20 days')::date, true, 1),
    (demo_event, 'Confirmer le traiteur', 'Prestataires', (now() + interval '7 days')::date, true, 2),
    (demo_event, 'Essayage final robe', 'Tenues', (now() + interval '14 days')::date, false, 3),
    (demo_event, 'Répétition cérémonie', 'Cérémonie', (now() + interval '28 days')::date, false, 4),
    (demo_event, 'Playlist DJ validée', 'Musique', (now() + interval '20 days')::date, false, 5);

  INSERT INTO public.budget_items (event_id, label, category, estimated, actual, paid) VALUES
    (demo_event, 'Traiteur', 'Restauration', 8500, 8200, true),
    (demo_event, 'Photographe', 'Prestataires', 2400, 2400, true),
    (demo_event, 'Fleurs', 'Décoration', 1200, 950, false),
    (demo_event, 'DJ', 'Musique', 1500, 1500, true),
    (demo_event, 'Location château', 'Lieu', 6500, 6500, true);

  INSERT INTO public.timeline_items (event_id, time_label, title, description, position) VALUES
    (demo_event, '15:00', 'Cérémonie civile', 'Mairie de Rueil-Malmaison', 1),
    (demo_event, '16:30', 'Cocktail', 'Jardins du château', 2),
    (demo_event, '19:30', 'Dîner', 'Grande salle', 3),
    (demo_event, '22:00', 'Ouverture de bal', 'Première danse', 4),
    (demo_event, '04:00', 'Fin de soirée', 'Brunch le lendemain', 5);

  INSERT INTO public.stories (event_id, author_name, author_avatar, media_url, media_type) VALUES
    (demo_event, 'Léa', 'https://i.pravatar.cc/100?img=47', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', 'image'),
    (demo_event, 'Camille', 'https://i.pravatar.cc/100?img=32', 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600', 'image');

  INSERT INTO public.album_media (event_id, uploader_name, url, media_type, caption) VALUES
    (demo_event, 'Léa', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'image', 'Les préparatifs 🌸'),
    (demo_event, 'Jules', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', 'image', 'Repérage du lieu'),
    (demo_event, 'Camille', 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800', 'image', 'Test bouquet');

  INSERT INTO public.live_reactions (event_id, emoji) VALUES
    (demo_event, '❤️'), (demo_event, '🎉'), (demo_event, '💍'), (demo_event, '✨');
END $$;
