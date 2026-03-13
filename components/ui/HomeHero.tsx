"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HeroSearch from "./HeroSearch";

const item = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.65,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

export default function HomeHero() {
  return (
    <Box
      sx={{
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: { xs: 3, md: 6 },
      }}
    >
      <motion.div {...item(0)}>
        <Typography
          variant="h1"
          component="h1"
          sx={{ color: "text.primary", userSelect: "none", mb: 0 }}
        >
          Visual reference
        </Typography>
        <Typography
          variant="h1"
          component="div"
          sx={{ color: "text.secondary", userSelect: "none" }}
        >
          for every frame.
        </Typography>
      </motion.div>

      <motion.div {...item(0.12)}>
        <Typography
          sx={{
            fontSize: 15,
            maxWidth: 300,
            mx: "auto",
            mt: 2.5,
            mb: 5,
            lineHeight: 1.65,
            color: "text.secondary",
          }}
        >
          Curated GIFs, stills, and clips for filmmakers, DPs, directors, and designers.
        </Typography>
      </motion.div>

      <motion.div {...item(0.24)} style={{ width: "100%", maxWidth: 560 }}>
        <HeroSearch />
      </motion.div>
    </Box>
  );
}
