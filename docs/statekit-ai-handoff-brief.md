# StateKit AI Handoff Brief

## 项目一句话

StateKit 是一个面向 SaaS 产品的场景化状态界面组件库，当前以 Vue 3 为主，专注 empty / loading / error / permission / upgrade / success 这类状态页和流程组件。

## 当前仓库事实

- 仓库是 monorepo。
- `packages/shared` 是 Block 类型和元数据的单一事实来源。
- `packages/vue` 提供预制组件与样式。
- `apps/docs` 是文档站和主要人工 QA 面板。
- `examples/vite-vue-admin` 用于展示更真实的集成场景。

## 当前实现方式

- 每个 Block 通过 shared 中的元数据定义默认标题、描述、tone、density、layout 和 CTA。
- Vue 层大多是薄 wrapper，核心渲染逻辑在 `StatePresetBlock` 和 `StateBlockShell`。
- docs 站直接读取 shared 元数据，因此元数据变更会同步影响 docs 展示。

## V1 已实现范围

- 18 个 Block
- 6 个类别：`empty`、`loading`、`error`、`permission`、`upgrade`、`success`
- 3 种布局：`inline`、`panel`、`page`
- 5 种 tone：`neutral`、`brand`、`danger`、`warning`、`success`

说明：onboarding 还不是独立类别，当前由 `first-project` 这种 first-run empty state 表达。

## 如果你要继续开发

先遵守这条顺序：

1. 先改 shared 规格。
2. 再改 Vue 导出与实现。
3. 再改 docs 展示与 example 集成。

不要倒过来先改 docs 页面文案，再去补 shared 元数据。

## 你最应该看的文件

- `packages/shared/src/types.ts`
- `packages/shared/src/block-meta.ts`
- `packages/vue/src/base/StatePresetBlock.vue`
- `packages/vue/src/base/StateBlockShell.vue`
- `apps/docs/src/router.ts`
- `apps/docs/src/lib/block-docs.ts`
- `apps/docs/src/lib/block-components.ts`

## 不要误判的地方

- StateKit 不是通用组件库。
- 目前没有第三个 CTA、复杂 slot 或高度个性化插画系统。
- docs 站不是 marketing site，而是产品文档和 QA 工具。
- 当前没有自动化视觉测试，很多变更仍需人工检查 docs/example。

## 当前优先方向

- 补齐根 README 与中文 README。
- 扩充 example 场景，而不是盲目增加 Block 数量。
- 如果新增 Block，优先解决真实缺口，而不是追求类别对称。
- 逐步提升 QA 自动化能力。
