/**
 * StateKit ?????
 * 1. ??? Vite ???
 * 2. ????? docs ????????????? Vue ???????
 * 3. ?????????????????????????????????
 */

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@statekit/vue/styles.css",
        replacement: fileURLToPath(new URL("../../packages/vue/src/styles/index.css", import.meta.url)),
      },
      {
        find: "@statekit/shared",
        replacement: fileURLToPath(new URL("../../packages/shared/src/index.ts", import.meta.url)),
      },
      {
        find: "@statekit/vue",
        replacement: fileURLToPath(new URL("../../packages/vue/src/index.ts", import.meta.url)),
      },
    ],
  },
});
