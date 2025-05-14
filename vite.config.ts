import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

export default defineConfig({
  base: "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true, // ✅ fix
    hmr: {
      overlay: false,
    },
  },
  define: {
    "import.meta.env.VITE_TEMPO": JSON.stringify("true"),
  },
  build: {
    target: "esnext",
    minify: "esbuild",
  },
});
