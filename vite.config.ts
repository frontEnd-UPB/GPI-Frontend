import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let apiProxyTarget = env.VITE_API_BASE_URL;

  if (!apiProxyTarget) {
    apiProxyTarget = "http://localhost:3001"; // Fallback para que pullrequest no falle, pues no cuenta con el .env con la variable VITE_API_BASE_URL, pero en producción se espera que esta variable esté presente.
    //throw new Error("Missing VITE_API_BASE_URL in .env");
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});
