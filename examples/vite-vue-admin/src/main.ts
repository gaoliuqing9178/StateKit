/**
 * StateKit example app 入口
 * 1. 作用：创建并挂载 vite-vue-admin 示例应用
 * 2. 导入顺序：先加载 StateKit 样式，再加载 example 自身样式，确保覆盖层级正确
 * 3. 维护要点：example 不使用 Vue Router，整个示例以单页叙事流的方式呈现 onboarding-to-completion 路径
 */

import { createApp } from "vue";
import App from "./App.vue";
import "@statekit-vue/vue/styles.css";
import "./styles.css";
createApp(App).mount("#app");
