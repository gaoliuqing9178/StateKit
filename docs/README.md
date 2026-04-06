# StateKit Docs

StateKit 是一个面向 SaaS 产品的 category-first 状态界面组件库。它专注 empty / loading / error / permission / upgrade / success 这类状态页与流程组件，而不是通用按钮、表单控件或弹窗库。

这份 `docs` 目录是项目的内部文档集合。它的目标不是写概念口号，而是把产品定位、规格边界、实现方式、文档站结构、QA 和发布动作统一到一套可执行说明里。

## 当前代码范围

- 仓库是一个 monorepo，当前包含 `@statekit-vue/shared`、`@statekit-vue/vue`、`@statekit/docs` 和 `@statekit/example-vite-vue-admin` 四个主要 workspace。
- V1 当前对外主路径是 6 个按类别统一的组件入口：`EmptyState`、`LoadingState`、`ErrorState`、`PermissionState`、`UpgradeState`、`SuccessState`。
- 底层仍保留 18 个 preset recipe，覆盖 6 个类别：`empty`、`loading`、`error`、`permission`、`upgrade`、`success`。
- 旧的场景名导出仍然存在，但只作为 deprecated compatibility exports 保留，不再是推荐的公开 API 主路径。
- 所有类别组件和 preset recipe 共用同一套基础 API：`title`、`description`、`tone`、`density`、`layout`、`primaryAction`、`secondaryAction`。
- 当前支持 3 种布局：`inline`、`panel`、`page`。
- 当前支持 5 种 tone：`neutral`、`brand`、`danger`、`warning`、`success`。
- 独立 onboarding 类别还没有拆出，当前由 `first-project` 这类 first-run empty recipe 承担。

## 阅读顺序

1. [statekit-v1-product-plan.md](./statekit-v1-product-plan.md)  
   先看产品定义、V1 范围、交付边界和非目标。
2. [statekit-block-spec.md](./statekit-block-spec.md)  
   再看 recipe 清单、通用 props 合同、文案规则和布局使用原则。
3. [statekit-implementation-blueprint.md](./statekit-implementation-blueprint.md)  
   确认 monorepo 结构、数据流、修改 recipe 或公共 API 的实现步骤和验证命令。
4. [statekit-visual-system.md](./statekit-visual-system.md)  
   对齐 tone、density、layout、插画语义和 CTA 规范。
5. [statekit-docs-site-and-qa-spec.md](./statekit-docs-site-and-qa-spec.md)  
   用于维护 `apps/docs` 的信息架构、页面要求和 QA 检查项。
6. [statekit-readme-outline.md](./statekit-readme-outline.md)  
   用于持续维护根目录 README 和本地化 README 的结构与口径一致。
7. [statekit-launch-checklist.md](./statekit-launch-checklist.md)  
   用于正式发布前的收口与自检。
8. [statekit-ai-handoff-brief.md](./statekit-ai-handoff-brief.md)  
   用于把当前项目状态快速交接给新成员或 AI 协作者。

## 文档约束

- 文档必须以源码为准，尤其以 `packages/shared/src/types.ts` 和 `packages/shared/src/block-meta.ts` 作为 recipe 规格的事实来源。
- 如果实现与文档不一致，先确认 shared 层的真实状态，再把 Vue、docs、README 和交接文档同步回来。
- 文档必须明确区分“公开类别入口”和“底层 preset recipe”，不要再把 18 个 recipe 写成唯一的公开 API。
- 如果你修改了公开行为，至少同步这些文件：
  - `README.md`
  - `README.zh-CN.md`
  - `CHANGELOG.md`
  - `docs/statekit-block-spec.md`
  - `docs/statekit-ai-handoff-brief.md`
  - `docs/statekit-launch-checklist.md`
- 如果你改的是 docs 示例或 Block 详情页说明，记得一起检查：
  - `apps/docs/src/lib/recipe-components.ts`
  - `apps/docs/src/lib/example-code.ts`
  - `apps/docs/src/views/`
  - `examples/vite-vue-admin/src/App.vue`

## 修改顺序

建议按这个顺序工作：

1. 先改 `packages/shared` 中的类型或元数据。
2. 再改 `packages/vue` 中的类别组件、兼容导出或共享渲染层。
3. 再改 `apps/docs` 和 `examples/vite-vue-admin`。
4. 最后补 README、changelog、handoff 和 checklist。

不要倒过来先改文档口号，再回头猜实现应该是什么。
