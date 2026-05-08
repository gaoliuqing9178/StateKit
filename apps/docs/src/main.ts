/**
 * StateKit docs 站应用入口
 * 1. 作用：创建并挂载 docs Vue 应用
 * 2. 依次加载 Vue 应用、路由、全局样式和 demo 区域样式，保持加载顺序不随意改变
 * 3. 维护要点：样式加载顺序影响优先级，不要把 demo-styles 挪到 styles 前面
 */

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles.css";
import "./demo-styles.css";
createApp(App).use(router).mount("#app");
