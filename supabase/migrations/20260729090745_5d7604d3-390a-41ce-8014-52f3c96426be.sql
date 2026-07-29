
CREATE TABLE public.post_bookmarks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_bookmarks TO authenticated;
GRANT ALL ON public.post_bookmarks TO service_role;
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookmarks read" ON public.post_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own bookmarks insert" ON public.post_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own bookmarks delete" ON public.post_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX post_bookmarks_user_created_idx ON public.post_bookmarks (user_id, created_at DESC);
