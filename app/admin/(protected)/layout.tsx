import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", user.email)
    .single();

  if (!adminUser || adminUser.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userEmail={user.email!} />
      <main className="flex-1 min-w-0 overflow-auto bg-background">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
