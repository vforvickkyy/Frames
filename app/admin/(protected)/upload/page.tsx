import UploadForm from "@/components/admin/UploadForm";
import { getCategories, getTags } from "@/lib/queries";

export default async function UploadPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Upload Frame</h1>
        <p className="text-sm text-muted mt-1">
          Upload a GIF, image, or video clip and fill in the metadata.
        </p>
      </div>
      <UploadForm categories={categories} tags={tags} />
    </div>
  );
}
