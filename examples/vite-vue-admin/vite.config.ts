/**
 * StateKit example app Vite 配置
 * 1. 作用：为 examples/vite-vue-admin 配置开发服务器和构建选项
 * 2. resolve.alias 把 @statekit-vue/shared 和 @statekit-vue/vue 指向 monorepo 源码，
 *    确保 example 始终跑当前工作区的最新实现，而不是已发布的 dist
 * 3. 维护要点：example 应像真实消费者一样通过公开包入口使用 StateKit，alias 是开发便利，不是额外 API
 */

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@statekit-vue/vue/styles.css",
        replacement: fileURLToPath(new URL("../../packages/vue/src/styles/index.css", import.meta.url)),
      },
      {
        find: "@statekit-vue/shared",
        replacement: fileURLToPath(new URL("../../packages/shared/src/index.ts", import.meta.url)),
      },
      {
        find: "@statekit-vue/vue",
        replacement: fileURLToPath(new URL("../../packages/vue/src/index.ts", import.meta.url)),
      },
    ],
  },
});
