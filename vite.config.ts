import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h, Fragment } from 'preact'`,
  },
  plugins: [preact()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
});
