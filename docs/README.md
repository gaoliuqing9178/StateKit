# StateKit Docs

StateKit 是一个面向 SaaS 产品的 scenario-first 状态界面组件库。它专做 empty / loading / error / no permission / upgrade / onboarding / success 这类状态页与流程组件，而不是通用按钮、表单控件或弹窗库。

这份 `docs` 目录是项目的内部文档集合，目标不是写概念口号，而是把产品定位、Block 规格、实现边界、文档站结构、QA 和发布动作统一到一套可执行说明里。

## 当前代码范围

- 仓库是一个 monorepo，当前包含 `@statekit/shared`、`@statekit/vue`、`@statekit/docs` 和 `@statekit/example-vite-vue-admin` 四个主要 workspace。
- V1 已落地 18 个状态 Block，覆盖 6 个类别：`empty`、`loading`、`error`、`permission`、`upgrade`、`success`。
- 每个 Block 都基于同一套基础 API：`title`、`description`、`tone`、`density`、`layout`、`primaryAction`、`secondaryAction`。
- 支持三种布局：`inline`、`panel`、`page`。
- 支持五种 tone：`neutral`、`brand`、`danger`、`warning`、`success`。
- 独立的 onboarding 类别还没有拆出，当前由 `first-project` 这类 first-run empty state 承担。

## 阅读顺序

1. [statekit-v1-product-plan.md](./statekit-v1-product-plan.md)  
   先看产品定义、V1 范围、交付边界和非目标。
2. [statekit-block-spec.md](./statekit-block-spec.md)  
   再看 Block 清单、通用 props 合同、文案规则和布局使用原则。
3. [statekit-implementation-blueprint.md](./statekit-implementation-blueprint.md)  
   确认 monorepo 结构、数据流、加新 Block 的实现步骤和验证命令。
4. [statekit-visual-system.md](./statekit-visual-system.md)  
   对齐 tone、density、layout、插画语义和 CTA 规范。
5. [statekit-docs-site-and-qa-spec.md](./statekit-docs-site-and-qa-spec.md)  
   用于维护 `apps/docs` 的信息架构、页面要求和 QA 检查项。
6. [statekit-readme-outline.md](./statekit-readme-outline.md)  
   用于后续重写根目录 README 和本地化 README。
7. [statekit-launch-checklist.md](./statekit-launch-checklist.md)  
   用于正式发布前的收口与自检。
8. [statekit-ai-handoff-brief.md](./statekit-ai-handoff-brief.md)  
   用于把当前项目状态快速交接给新成员或 AI 协作者。

## 文档约束

- 文档必须以源码为准，尤其以 `packages/shared/src/types.ts` 和 `packages/shared/src/block-meta.ts` 作为 Block 规格的事实来源。
- 文档可以描述 V1 后续方向，但必须明确标注哪些已经实现，哪些仍是后续路线。
- 如果实现与文档不一致，优先修正文档；只有在决定更改产品行为时才调整实现。
