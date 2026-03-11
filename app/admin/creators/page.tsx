import { createServiceClient } from "@/lib/supabase/server";
import CreatorsManager from "@/components/admin/CreatorsManager";

export default async function CreatorsPage() {
  const supabase = await createServiceClient();
  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .order("display_name");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Creators</h1>
        <p className="text-sm text-muted mt-1">
          Manage creator profiles on the platform.
        </p>
      </div>
      <CreatorsManager creators={creators ?? []} />
    </div>
  );
}
