import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    include: ["packages/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@statekit-vue/shared": fileURLToPath(
        new URL("./packages/shared/src/index.ts", import.meta.url),
      ),
      "@statekit-vue/react": fileURLToPath(
        new URL("./packages/react/src/index.ts", import.meta.url),
      ),
      "@statekit-vue/vue": fileURLToPath(
        new URL("./packages/vue/src/index.ts", import.meta.url),
      ),
    },
  },
});
