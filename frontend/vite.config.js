import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        [env.VITE_API_BASE]: {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },

        [env.VITE_SOCKET_PATH]: {
          target: "http://localhost:5000",
          ws: true,
          changeOrigin: true,
          secure: false,
        },

        "/files": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
