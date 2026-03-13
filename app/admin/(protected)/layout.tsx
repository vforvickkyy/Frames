import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Box from "@mui/material/Box";

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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminSidebar userEmail={user.email!} />
      <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: "auto", bgcolor: "background.default" }}>
        <Box sx={{ maxWidth: "80rem", mx: "auto", p: { xs: 3, lg: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
