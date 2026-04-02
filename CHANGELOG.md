# StateKit 改动说明

这轮内容可以概括为七块：

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

## 5. `StateBlockShell` 的中等宽度响应式细节已继续修正

- `page` 布局下的 `sk-shell__actions` 现在会居中显示，避免 CTA 仍贴左导致页面型状态块失衡。
- `panel` 布局在 `1160px` 及以下会提前折叠成单栏，并按 `compact` / `cozy` / `spacious` density 采用不同的内边距。
- `.sk-shell__content` 现在补上了 `min-width: 0`，用于避免标题、描述和按钮在中等宽度下被 grid 子项挤压后发生遮挡。
- 这轮修正主要覆盖此前实际暴露出来的 `page` CTA 对齐问题，以及 `panel` 在 `1160px~1000px`、`920px~760px` 一带的标题和按钮裁切问题。
- 关键文件：
  - `packages/vue/src/styles/base.css`

## 6. 发布面文档口径已对齐

- `README.md`、`README.zh-CN.md`、`CHANGELOG.md`、`剩餘部分.md`、`docs/statekit-ai-handoff-brief.md`、`docs/statekit-launch-checklist.md` 现在使用同一套对外口径。
- 根 README 与中文 README 已补齐，不再把“重写 README”作为当前待完成项。
- V1 仍明确是 18 个 Block / 6 个类别；onboarding 继续通过 `FirstProjectState` 这类 first-run empty state 承接，而不是独立类别。
- 当前验证状态统一以最新命令结果为准，不再沿用过期的未验证说明。

## 7. npm 包已切换到 `@statekit-vue/*` scope 并完成首发

- 发布 scope 已从仓库内部沿用的 `@statekit/*` 调整为实际可发布的 `@statekit-vue/*`。
- 根脚本、workspace 依赖、TypeScript path alias、Vite alias、docs/example 引用、README 和 smoke install 流程都已切换到 `@statekit-vue/shared` 与 `@statekit-vue/vue`。
- `@statekit-vue/shared@0.1.0` 与 `@statekit-vue/vue@0.1.0` 已完成首次发布；首发时 `latest` dist-tag 均指向 `0.1.0`，包状态为 `public`。
- 后续继续发版时，需要同时升级 `packages/shared/package.json`、`packages/vue/package.json`，以及 `packages/vue/package.json` 中对 `@statekit-vue/shared` 的依赖版本。

## 验证状态

- `npm run typecheck` 已通过。
- `npm run build` 已通过。
- `npm run pack:check` 已通过。
- `npm run smoke:install` 已通过。
- 以上四项已经在当前 docs / example / README / `StateBlockShell` 响应式调整之后重新执行。

### Changed

- Rebuilt the docs block detail experience in [apps/docs/src/views/BlockDetailView.vue](./apps/docs/src/views/BlockDetailView.vue), [apps/docs/src/lib/example-code.ts](./apps/docs/src/lib/example-code.ts), and [apps/docs/src/styles.css](./apps/docs/src/styles.css) so each block page now explains content customization, prop-passing patterns, CTA action fields, and ready-to-copy usage snippets. The detail layout also wraps cleanly at medium widths so the top detail sections no longer clip inside the Blocks page.
- Rewrote the docs example routes in [apps/docs/src/views/examples/AdminEmptyStatesView.vue](./apps/docs/src/views/examples/AdminEmptyStatesView.vue), [apps/docs/src/views/examples/PermissionsAndUpgradeView.vue](./apps/docs/src/views/examples/PermissionsAndUpgradeView.vue), and [apps/docs/src/views/examples/TaskFlowView.vue](./apps/docs/src/views/examples/TaskFlowView.vue), plus the shared example copy in [apps/docs/src/lib/copy.ts](./apps/docs/src/lib/copy.ts) and [apps/docs/src/demo-styles.css](./apps/docs/src/demo-styles.css), so the examples reflect the current CTA API instead of the earlier placeholder flows.
- Updated the external consumer example in [examples/vite-vue-admin/src/App.vue](./examples/vite-vue-admin/src/App.vue) and [examples/vite-vue-admin/src/styles.css](./examples/vite-vue-admin/src/styles.css) to demonstrate the current action surface with `onClick`, `href`, `loading`, `loadingLabel`, `disabled`, and explicit `null` action removal.
- Refreshed the root docs in [README.md](./README.md) and [README.zh-CN.md](./README.zh-CN.md) so the repository-level documentation matches the current action object, parameter passing rules, and docs/example entry points.
- Polished [packages/vue/src/styles/base.css](./packages/vue/src/styles/base.css) so `page` layout actions center correctly and `panel` layout collapses earlier at medium widths, preventing title and CTA clipping in the shared shell.
- Aligned the release-facing docs and handoff notes in [README.md](./README.md), [README.zh-CN.md](./README.zh-CN.md), [CHANGELOG.md](./CHANGELOG.md), [剩餘部分.md](./剩餘部分.md), [docs/statekit-ai-handoff-brief.md](./docs/statekit-ai-handoff-brief.md), and [docs/statekit-launch-checklist.md](./docs/statekit-launch-checklist.md) so completion status, remaining work, validation, and V1 scope now use the same wording.
- Renamed the publishable packages from `@statekit/shared` and `@statekit/vue` to `@statekit-vue/shared` and `@statekit-vue/vue`, then updated workspace scripts, aliases, docs, examples, and smoke-install coverage to match the new public scope.
- Added [TODO.md](./TODO.md) to collect the remaining release, QA, and follow-up work into one executable checklist.

### Verified

- `npm run typecheck`, `npm run build`, `npm run pack:check`, and `npm run smoke:install` pass against the current workspace state.
- `smoke:install` completes with an external consumer install plus production build using the published package surface.
- `@statekit-vue/shared@0.1.1` and `@statekit-vue/vue@0.1.1` are published on npm with public access and `latest` pointing at `0.1.1`.

## 2026-04-02 Patch Release Prep (0.1.1)

- Bumped `@statekit-vue/shared` from `0.1.0` to `0.1.1`.
- Bumped `@statekit-vue/vue` from `0.1.0` to `0.1.1` and aligned its dependency on `@statekit-vue/shared` to `0.1.1`.
- Updated the docs app, example app, and lockfile so the workspace resolves against the `0.1.1` package line before publish.

## 2026-04-02 Patch Release Prep (0.1.2)

- Bumped `@statekit-vue/shared` from `0.1.1` to `0.1.2`.
- Bumped `@statekit-vue/vue` from `0.1.1` to `0.1.2` and aligned its dependency on `@statekit-vue/shared` to `0.1.2`.
- Updated the docs app, example app, and lockfile so the workspace resolves against the `0.1.2` package line before publish.
- Refreshed `packages/shared/README.md` and `packages/vue/README.md` so the npm package pages match the current shared exports, CTA action API, and install guidance.
- As of this release prep, the latest published npm version remains `0.1.1` until the `0.1.2` publish step is executed.
