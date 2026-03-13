import { getAdminStats } from "@/lib/queries";
import AdminOverview from "@/components/admin/AdminOverview";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  return <AdminOverview stats={stats} />;
}
