import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const packagePath = id.includes("node_modules/.pnpm")
              ? id.toString().split("node_modules/.pnpm/")[1]
              : id.toString().split("node_modules/")[1];

            return id.includes("node_modules/.pnpm")
              ? (packagePath[0] === "@" ? packagePath.replace("@", "") : packagePath).split("@")[0].toString()
              : packagePath.split("/")[0].toString();
          }

          return id.split("/")[0]
        },
      },
    },
  },
});
