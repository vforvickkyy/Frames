-- =============================================
-- Frames Platform - Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz default now()
);

-- Creators
create table if not exists creators (
  id uuid primary key default uuid_generate_v4(),
  username text not null unique,
  display_name text not null,
  bio text,
  avatar_url text,
  website text,
  instagram text,
  created_at timestamptz default now()
);

-- Tags
create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

-- Admin Users (created BEFORE frames so the is_admin() function can reference it)
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz default now()
);

-- Frames
create table if not exists frames (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  file_url text not null,
  thumbnail_url text,
  category_id uuid references categories(id) on delete set null,
  creator_id uuid references creators(id) on delete set null,
  tags text[] default '{}',
  technique_notes text,
  rank integer default 0,
  is_hidden boolean default false,
  view_count integer default 0,
  created_at timestamptz default now(),
  -- Full-text search generated column (searched via .textSearch("fts", ...))
  fts tsvector generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(technique_notes, '')
    )
  ) stored
);

-- Frame Tags (junction table)
create table if not exists frame_tags (
  frame_id uuid references frames(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (frame_id, tag_id)
);

-- =============================================
-- INDEXES
-- =============================================

create index if not exists frames_slug_idx on frames(slug);
create index if not exists frames_category_id_idx on frames(category_id);
create index if not exists frames_creator_id_idx on frames(creator_id);
create index if not exists frames_rank_idx on frames(rank desc);
create index if not exists frames_created_at_idx on frames(created_at desc);
create index if not exists frames_is_hidden_idx on frames(is_hidden);
create index if not exists frames_fts_idx on frames using gin(fts);
create index if not exists categories_slug_idx on categories(slug);
create index if not exists creators_username_idx on creators(username);
create index if not exists tags_slug_idx on tags(slug);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- is_admin(): used in RLS policies.
-- SECURITY DEFINER lets it bypass RLS on admin_users so it doesn't recurse.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from admin_users
    where email = auth.email()
      and role = 'admin'
  );
$$;

-- increment_view_count(): called from the frame detail page server component.
create or replace function increment_view_count(frame_id uuid)
returns void
language sql
security definer
as $$
  update frames
  set view_count = view_count + 1
  where id = frame_id;
$$;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table frames enable row level security;
alter table categories enable row level security;
alter table creators enable row level security;
alter table tags enable row level security;
alter table frame_tags enable row level security;
alter table admin_users enable row level security;

-- ── frames ────────────────────────────────────────────────────────────────

-- Public: only visible (non-hidden) frames
create policy "Public can view visible frames"
  on frames for select
  using (is_hidden = false);

-- Admins: can see ALL frames (including hidden) and full write access
create policy "Admins can select all frames"
  on frames for select
  using (is_admin());

create policy "Admins can insert frames"
  on frames for insert
  with check (is_admin());

create policy "Admins can update frames"
  on frames for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete frames"
  on frames for delete
  using (is_admin());

-- ── categories ────────────────────────────────────────────────────────────

create policy "Public can view categories"
  on categories for select
  using (true);

create policy "Admins can insert categories"
  on categories for insert
  with check (is_admin());

create policy "Admins can update categories"
  on categories for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete categories"
  on categories for delete
  using (is_admin());

-- ── creators ──────────────────────────────────────────────────────────────

create policy "Public can view creators"
  on creators for select
  using (true);

create policy "Admins can insert creators"
  on creators for insert
  with check (is_admin());

create policy "Admins can update creators"
  on creators for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete creators"
  on creators for delete
  using (is_admin());

-- ── tags ──────────────────────────────────────────────────────────────────

create policy "Public can view tags"
  on tags for select
  using (true);

create policy "Admins can insert tags"
  on tags for insert
  with check (is_admin());

create policy "Admins can delete tags"
  on tags for delete
  using (is_admin());

-- ── frame_tags ────────────────────────────────────────────────────────────

create policy "Public can view frame_tags"
  on frame_tags for select
  using (true);

create policy "Admins can insert frame_tags"
  on frame_tags for insert
  with check (is_admin());

create policy "Admins can delete frame_tags"
  on frame_tags for delete
  using (is_admin());

-- ── admin_users ───────────────────────────────────────────────────────────

-- Authenticated users can read their own row (for role check in middleware/login)
create policy "Users can read their own admin record"
  on admin_users for select
  using (email = auth.email());

-- Only existing admins can manage other admins
create policy "Admins can manage admin_users"
  on admin_users for all
  using (is_admin())
  with check (is_admin());

-- =============================================
-- SAMPLE DATA (optional seed)
-- =============================================

insert into categories (name, slug, description) values
  ('Cinematography', 'cinematography', 'Visual storytelling through camera work, lighting, and composition'),
  ('Color Grading', 'color-grading', 'Post-production color techniques and visual moods'),
  ('Motion Graphics', 'motion-graphics', 'Animated graphics, title sequences, and visual effects'),
  ('Commercial', 'commercial', 'Advertising and brand-focused visual work'),
  ('Music Video', 'music-video', 'Visual direction for music and performance'),
  ('Documentary', 'documentary', 'Non-fiction visual storytelling'),
  ('Fashion', 'fashion', 'Editorial and runway visual references'),
  ('Architecture', 'architecture', 'Built environment and spatial photography')
on conflict (slug) do nothing;

insert into tags (name, slug) values
  ('anamorphic', 'anamorphic'),
  ('bokeh', 'bokeh'),
  ('golden-hour', 'golden-hour'),
  ('neon', 'neon'),
  ('minimalist', 'minimalist'),
  ('noir', 'noir'),
  ('pastel', 'pastel'),
  ('high-contrast', 'high-contrast'),
  ('slow-motion', 'slow-motion'),
  ('wide-angle', 'wide-angle'),
  ('close-up', 'close-up'),
  ('overhead', 'overhead'),
  ('tracking-shot', 'tracking-shot'),
  ('handheld', 'handheld'),
  ('drone', 'drone')
on conflict (slug) do nothing;
