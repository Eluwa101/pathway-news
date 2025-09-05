-- Remove overly permissive policies and implement secure access controls

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on books" ON public.books;
DROP POLICY IF EXISTS "Allow all operations on career events" ON public.career_events;
DROP POLICY IF EXISTS "Allow all operations on career paths" ON public.career_paths;
DROP POLICY IF EXISTS "Allow all operations on devotionals" ON public.devotionals;
DROP POLICY IF EXISTS "Allow all operations on news" ON public.news;
DROP POLICY IF EXISTS "Allow all operations on recordings" ON public.recordings;
DROP POLICY IF EXISTS "Allow all operations on whatsapp groups" ON public.whatsapp_groups;

-- Books table policies
CREATE POLICY "Public can view published books" ON public.books
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert books" ON public.books
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update books" ON public.books
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete books" ON public.books
  FOR DELETE TO authenticated USING (true);

-- Career events table policies
CREATE POLICY "Public can view published career events" ON public.career_events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert career events" ON public.career_events
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update career events" ON public.career_events
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete career events" ON public.career_events
  FOR DELETE TO authenticated USING (true);

-- Career paths table policies
CREATE POLICY "Public can view published career paths" ON public.career_paths
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert career paths" ON public.career_paths
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update career paths" ON public.career_paths
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete career paths" ON public.career_paths
  FOR DELETE TO authenticated USING (true);

-- Devotionals table policies
CREATE POLICY "Public can view published devotionals" ON public.devotionals
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert devotionals" ON public.devotionals
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update devotionals" ON public.devotionals
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete devotionals" ON public.devotionals
  FOR DELETE TO authenticated USING (true);

-- News table policies
CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert news" ON public.news
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update news" ON public.news
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news" ON public.news
  FOR DELETE TO authenticated USING (true);

-- Recordings table policies
CREATE POLICY "Public can view published recordings" ON public.recordings
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert recordings" ON public.recordings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update recordings" ON public.recordings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recordings" ON public.recordings
  FOR DELETE TO authenticated USING (true);

-- WhatsApp groups table policies
CREATE POLICY "Public can view published whatsapp groups" ON public.whatsapp_groups
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert whatsapp groups" ON public.whatsapp_groups
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update whatsapp groups" ON public.whatsapp_groups
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete whatsapp groups" ON public.whatsapp_groups
  FOR DELETE TO authenticated USING (true);