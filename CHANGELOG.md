# StateKit 改动说明

这轮内容可以概括为四块：

## 1. CTA Action API 已经补齐

- `StateAction` 现在支持 `label`、`href`、`disabled`、`loading`、`loadingLabel`、`onClick`。
- `primaryAction` / `secondaryAction` 现在支持 `null`，用于显式移除预设按钮。
- 共享 shell 现在统一处理按钮与链接渲染、loading 文案、disabled 样式、重复点击拦截，以及 loading / disabled 时的链接跳转阻止。
- 关键文件：
  - `packages/shared/src/types.ts`
  - `packages/vue/src/types.ts`
  - `packages/vue/src/base/StatePresetBlock.vue`
  - `packages/vue/src/base/StateBlockShell.vue`
  - `packages/vue/src/styles/base.css`

## 2. Docs 的 Blocks 详情页已经重写成“用法文档页”

- 每个 block 详情页现在不仅展示预览，还详细说明：
  - 这个组件适合什么场景
  - 默认布局 / density / tone / CTA 模式
  - `title`、`description`、`tone`、`density`、`layout` 怎么传
  - `primaryAction`、`secondaryAction` 怎么传
  - 按钮文字怎么自定义
  - 点击事件怎么绑定到 `onClick`
  - `href`、`loading`、`loadingLabel`、`disabled` 怎么使用
  - 什么时候传 `null` 去掉预设按钮
  - 固定值、脚本变量、`v-bind` 对象三种传参方式
- 关键文件：
  - `apps/docs/src/views/BlockDetailView.vue`
  - `apps/docs/src/lib/example-code.ts`
  - `apps/docs/src/styles.css`

## 3. Blocks 页面中宽度排版问题已经被纳入文档更新范围

- docs 详情页的网格和卡片样式已经补上 `min-width: 0` 与多档响应式布局。
- 目标是避免在中等宽度下 detail sections 被挤压、裁切或遮挡。
- 后续如果还要继续微调，优先看：
  - `apps/docs/src/styles.css`

## 4. Example 页面已按当前组件能力重写

- docs 内的三个 example 路由已经从旧占位演示改成真实交互场景：
  - `Admin Empty States`
  - `Permissions And Upgrade`
  - `Task Flow`
- 外部示例 `examples/vite-vue-admin` 也已同步成当前 API 的真实消费方式。
- 这些页面现在明确展示：
  - `onClick`
  - `href`
  - `loading`
  - `loadingLabel`
  - `disabled`
  - `null` 移除次要按钮
- 关键文件：
  - `apps/docs/src/views/examples/AdminEmptyStatesView.vue`
  - `apps/docs/src/views/examples/PermissionsAndUpgradeView.vue`
  - `apps/docs/src/views/examples/TaskFlowView.vue`
  - `apps/docs/src/demo-styles.css`
  - `apps/docs/src/lib/copy.ts`
  - `examples/vite-vue-admin/src/App.vue`
  - `examples/vite-vue-admin/src/styles.css`

## 验证状态

- `npm run typecheck` 已通过。
- `npm run build` 已通过。
- 这两项验证是在 example 重写之后重新跑过的。

### Changed

- Rebuilt the docs block detail experience in [apps/docs/src/views/BlockDetailView.vue](./apps/docs/src/views/BlockDetailView.vue), [apps/docs/src/lib/example-code.ts](./apps/docs/src/lib/example-code.ts), and [apps/docs/src/styles.css](./apps/docs/src/styles.css) so each block page now explains content customization, prop-passing patterns, CTA action fields, and ready-to-copy usage snippets. The detail layout also wraps cleanly at medium widths so the top detail sections no longer clip inside the Blocks page.
- Rewrote the docs example routes in [apps/docs/src/views/examples/AdminEmptyStatesView.vue](./apps/docs/src/views/examples/AdminEmptyStatesView.vue), [apps/docs/src/views/examples/PermissionsAndUpgradeView.vue](./apps/docs/src/views/examples/PermissionsAndUpgradeView.vue), and [apps/docs/src/views/examples/TaskFlowView.vue](./apps/docs/src/views/examples/TaskFlowView.vue), plus the shared example copy in [apps/docs/src/lib/copy.ts](./apps/docs/src/lib/copy.ts) and [apps/docs/src/demo-styles.css](./apps/docs/src/demo-styles.css), so the examples reflect the current CTA API instead of the earlier placeholder flows.
- Updated the external consumer example in [examples/vite-vue-admin/src/App.vue](./examples/vite-vue-admin/src/App.vue) and [examples/vite-vue-admin/src/styles.css](./examples/vite-vue-admin/src/styles.css) to demonstrate the current action surface with `onClick`, `href`, `loading`, `loadingLabel`, `disabled`, and explicit `null` action removal.
- Refreshed the root docs in [README.md](./README.md) and [README.zh-CN.md](./README.zh-CN.md) so the repository-level documentation matches the current action object, parameter passing rules, and docs/example entry points.

### Verified

- `npm run typecheck` and `npm run build` pass after the docs block-detail rewrite and example refresh.
