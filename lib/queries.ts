import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Frame, Category, Creator, Tag, PaginatedFrames } from "@/types";

const PAGE_SIZE = 24;

// ---- Frames ----

export async function getFrames(
  page = 1,
  options: { category?: string; tag?: string; search?: string } = {}
): Promise<PaginatedFrames> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("frames")
    .select(
      `*, category:categories(id,name,slug), creator:creators(id,username,display_name,avatar_url)`,
      { count: "exact" }
    )
    .eq("is_hidden", false)
    .order("rank", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (options.search) {
    // "fts" is a generated stored tsvector column; websearch handles natural queries
    query = query.textSearch("fts", options.search.trim(), {
      type: "websearch",
      config: "english",
    });
  }

  if (options.tag) {
    query = query.contains("tags", [options.tag]);
  }

  const { data, count, error } = await query;
  if (error) console.error("getFrames error:", error);

  return {
    frames: (data as Frame[]) ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    hasMore: (count ?? 0) > page * PAGE_SIZE,
  };
}

export async function getFrameBySlug(slug: string): Promise<Frame | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("frames")
    .select(
      `*, category:categories(id,name,slug,description), creator:creators(*), frame_tags(tags(id,name,slug))`
    )
    .eq("slug", slug)
    .eq("is_hidden", false)
    .single();

  if (error) return null;
  return data as Frame;
}

export async function getRelatedFrames(
  frameId: string,
  categoryId: string | null,
  limit = 6
): Promise<Frame[]> {
  const supabase = await createClient();
  let query = supabase
    .from("frames")
    .select(`*, creator:creators(id,username,display_name,avatar_url)`)
    .eq("is_hidden", false)
    .neq("id", frameId)
    .order("rank", { ascending: false })
    .limit(limit);

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data } = await query;
  return (data as Frame[]) ?? [];
}

export async function incrementViewCount(frameId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_view_count", { frame_id: frameId });
}

export async function getTrendingFrames(limit = 12): Promise<Frame[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("frames")
    .select(`*, creator:creators(id,username,display_name,avatar_url)`)
    .eq("is_hidden", false)
    .order("view_count", { ascending: false })
    .order("rank", { ascending: false })
    .limit(limit);
  return (data as Frame[]) ?? [];
}

export async function getRecentFrames(limit = 12): Promise<Frame[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("frames")
    .select(`*, creator:creators(id,username,display_name,avatar_url)`)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Frame[]) ?? [];
}

export async function getAllFrameSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("frames")
    .select("slug")
    .eq("is_hidden", false);
  return data?.map((f) => f.slug) ?? [];
}

// ---- Categories ----

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return (data as Category[]) ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Category) ?? null;
}

// ---- Creators ----

export async function getCreatorByUsername(
  username: string
): Promise<Creator | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("creators")
    .select("*")
    .eq("username", username)
    .single();
  return (data as Creator) ?? null;
}

export async function getCreatorFrames(
  creatorId: string,
  page = 1
): Promise<PaginatedFrames> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count } = await supabase
    .from("frames")
    .select(
      `*, category:categories(id,name,slug), creator:creators(id,username,display_name,avatar_url)`,
      { count: "exact" }
    )
    .eq("creator_id", creatorId)
    .eq("is_hidden", false)
    .order("rank", { ascending: false })
    .range(from, to);

  return {
    frames: (data as Frame[]) ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    hasMore: (count ?? 0) > page * PAGE_SIZE,
  };
}

export async function getAllCreatorUsernames(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("creators").select("username");
  return data?.map((c) => c.username) ?? [];
}

// ---- Tags ----

export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return (data as Tag[]) ?? [];
}

// ---- Admin ----

export async function isAdminUser(email: string): Promise<boolean> {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", email)
    .single();
  return data?.role === "admin";
}

export async function getAdminStats() {
  const supabase = await createServiceClient();
  const [framesResult, creatorsResult, categoriesResult] = await Promise.all([
    supabase.from("frames").select("id, view_count, title, slug, created_at, is_hidden", { count: "exact" }),
    supabase.from("creators").select("id", { count: "exact" }),
    supabase.from("categories").select("id", { count: "exact" }),
  ]);

  const totalViews = framesResult.data?.reduce((sum, f) => sum + (f.view_count || 0), 0) ?? 0;
  const topFrames = framesResult.data
    ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5) ?? [];

  return {
    totalFrames: framesResult.count ?? 0,
    totalCreators: creatorsResult.count ?? 0,
    totalCategories: categoriesResult.count ?? 0,
    totalViews,
    topFrames,
  };
}
