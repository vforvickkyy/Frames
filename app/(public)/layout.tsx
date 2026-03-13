import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Box from "@mui/material/Box";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ pt: "52px", flex: 1, width: "100%" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
