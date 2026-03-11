import { createServiceClient } from "@/lib/supabase/server";
import CategoriesManager from "@/components/admin/CategoriesManager";
import TagsManager from "@/components/admin/TagsManager";

export default async function CategoriesPage() {
  const supabase = await createServiceClient();
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Categories & Tags</h1>
        <p className="text-sm text-muted mt-1">
          Create, edit, and delete categories and tags.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <CategoriesManager categories={categories ?? []} />
        <TagsManager tags={tags ?? []} />
      </div>
    </div>
  );
}
