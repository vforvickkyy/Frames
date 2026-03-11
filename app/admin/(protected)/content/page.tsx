import { createServiceClient } from "@/lib/supabase/server";
import ContentTable from "@/components/admin/ContentTable";

export default async function ManageContentPage() {
  const supabase = await createServiceClient();
  const [{ data: frames }, { data: categories }, { data: creators }] = await Promise.all([
    supabase
      .from("frames")
      .select(`*, category:categories(id,name,slug), creator:creators(id,display_name,username)`)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("creators").select("id,display_name,username").order("display_name"),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Manage Content</h1>
        <p className="text-sm text-muted mt-1">
          Edit, delete, hide, or re-rank your frames.
        </p>
      </div>
      <ContentTable
        frames={frames ?? []}
        categories={categories ?? []}
        creators={creators ?? []}
      />
    </div>
  );
}
