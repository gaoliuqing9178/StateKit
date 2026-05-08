/**
 * StateKit Vue 包构建配置
 * 1. 作用：以 library 模式构建 Vue 组件包，输出 ES 格式的 index.js 和 style.css
 * 2. 将 vue 和 @statekit-vue/shared 声明为外部依赖，不打入产物
 * 3. 维护要点：新增公开导出时先更新 src/index.ts，构建产物路径由 rollupOptions.output 控制，不要手动改 dist/
 */

import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "StateKitVue",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "@statekit-vue/shared"],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === "style.css"
            ? "style.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
});
