import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "./palvelin/public",
    emptyOutDir: true,

    rollupOptions: {
      entryFileNames: "assets/[name].js",
      chunkFileNames: "assets/[name].js",
      assetFileNames: "assets/[name].[ext]",
    },
  },

  server: {
    proxy: {
      "/kukkatukku": {
        target: "http://localhost:4000",
      },
    },
  },
});
