import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/uploads": {
        target: process.env.VITE_API_URL ?? "https://api.pamarea.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
