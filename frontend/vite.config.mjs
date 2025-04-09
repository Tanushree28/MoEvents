import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(() => {
  return {
    base: "/admin/dashboard", // adjust this if you are deploying to a subpath
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "build",
    },
    plugins: [react()],
    server: {
      open: true,
      port: 3000,
    },
  };
});
