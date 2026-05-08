# StateKit AI Handoff Brief

## 项目一句话

StateKit 是一个面向 SaaS 产品的 category-first 状态 UI 组件库，当前以 Vue 3 为主，聚焦 empty / onboarding / loading / error / permission / upgrade / success 这类状态页与流程节点。

## 当前仓库事实

- 仓库是 monorepo。
- `packages/shared` 是 `@statekit-vue/shared` 的源码目录，也是共享类型与 recipe 元数据的单一事实来源。
- `packages/vue` 提供 `@statekit-vue/vue` 的组件实现、导出和默认样式。
- `apps/docs` 是文档站与主要人工 QA 面板，同时也是 Playwright 自动化回归的测试宿主。
- `examples/vite-vue-admin` 用于展示更真实的集成场景，当前以 onboarding-to-completion 流程为主线。
- 根目录 `AGENTS.md` 是 AI agent 入口地图，`docs/statekit-agent-harness.md` 说明 agent 工作循环和验证命令，`docs/agent-review-loop.md` 定义 Builder / Reviewer 双 agent 审查闭环。

## 当前实现方式

- 公开 API 已经收敛到 7 个 category-first 入口：`EmptyState`、`OnboardingState`、`LoadingState`、`ErrorState`、`PermissionState`、`UpgradeState`、`SuccessState`。
- 底层保留 21 个 preset recipes；旧场景名组件继续作为 deprecated compatibility exports 保留。
- Vue 层核心渲染逻辑集中在 `StatePresetBlock` 和 `StateBlockShell`。
- docs 站直接读取 shared 元数据，shared 变更会同步影响 docs 展示与示例代码。

## 当前版本状态

- npm 上最新已发布版本：
  - `@statekit-vue/shared@0.2.1`
  - `@statekit-vue/vue@0.2.1`
- 本地 workspace 当前已切到 `0.3.0` release-prep 版本线，等待最终验证和 npm 发布。

## 最近已经完成的工作

- 新增 `docs/statekit-scenario-gap-matrix.md`，用 `category × 用户阶段（start / operate / blocked / recover / finish）` 确认下一批 recipe 扩展缺口和不该新增组件名的场景。
- docs 站分类文案已收口到 `apps/docs/src/lib/category-docs.ts`，首页、recipes 列表和 recipe detail 都从同一份 docs-local 分类说明读取标签、说明和 category usage guide。
- `OnboardingActivationView` 已新增为 docs 的第四个示例页（`/examples/onboarding-activation`），串联完整 first-run 激活流程：workspace → 邀请成员 → 连接集成 → 完成。
- `examples/vite-vue-admin` 已重做为 onboarding-to-completion 叙事主线，覆盖全部 7 个 category-first 入口。
- Playwright 测试套件已扩展到 10 个 spec 文件，覆盖所有主路径和移动端断点。
- example 已完成第一轮视觉重做，方向是更安静、更开放的 editorial layout，而不是 admin 卡片墙。
- docs 示例页和 docs 站外层样式已一起收口，整体持续减少卡片感。
- onboarding 已作为独立 category 引入，当前提供 `OnboardingState` 以及 `onboarding-workspace`、`onboarding-members`、`onboarding-integration` 三个 recipes。
- 共享插图细节已修正：
  - success 去掉 shadow line
  - error cross 改成真正居中
  - permission lock 改成专用居中定位
- 交接文档当前维护在 `docs/交接/` 下。

## 如果你要继续开发

建议遵守这个顺序：

1. 先改 `packages/shared`
2. 再改 `packages/vue`
3. 再改 `apps/docs` 和 `examples/vite-vue-admin`
4. 最后同步 README、CHANGELOG、handoff brief 和 launch checklist

不要倒过来先改 docs 文案，再回头猜实现应该是什么。

## 你最应该看的文件

- `packages/shared/src/types.ts`
- `packages/shared/src/block-meta.ts`
- `packages/vue/src/base/StatePresetBlock.vue`
- `packages/vue/src/base/StateBlockShell.vue`
- `packages/vue/src/styles/base.css`
- `apps/docs/src/styles.css`
- `apps/docs/src/demo-styles.css`
- `AGENTS.md`
- `docs/statekit-agent-harness.md`
- `docs/agent-review-loop.md`
- `docs/agent-review-template.md`
- `apps/docs/src/router.ts`
- `apps/docs/src/lib/recipe-docs.ts`
- `apps/docs/src/lib/recipe-components.ts`
- `apps/docs/src/views/examples/OnboardingActivationView.vue`

## 不要误判的地方

- StateKit 不是通用组件库。
- onboarding 已经是独立 category，不要再默认把 first-run 激活语义塞回 `empty`。
- 当前没有第三个 CTA，也没有复杂 slot 系统。
- docs 站不是 marketing site，而是产品文档和 QA 工具。
- 当前已有 10 个 Playwright spec 文件覆盖主路径和移动端，但仍无自动化视觉像素级回归；插图细节调整仍需人工确认。

## 当前已验证

- `npm run typecheck` 已通过
- `npm run build` 已通过
- `npm run test:unit` 已通过
- `npm run test:ui` 已通过
- `npm run pack:check` 已通过
- `npm run smoke:install` 已通过（0.2.1 发布时）

## 当前优先方向

- 完成 `0.3.0` 发版前验证并发布两个 npm 包
- 人工浏览 `/examples/onboarding-activation` 和 `examples/vite-vue-admin`，确认 onboarding vs empty vs success 的语义边界在视觉上清晰
- 人工确认 3 个 onboarding recipes 的 family 感和语义边界
- 给 `error` / `permission` / `success` 这些插图补截图测试
- 持续维持 README、package README、launch checklist、handoff notes 的口径一致
