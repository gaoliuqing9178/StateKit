# StateKit Agent Guide

这份文件只做入口地图。更完整的项目事实以 `docs/` 下的文档和源码为准。

## 先读顺序

1. `docs/README.md`
2. `docs/statekit-ai-handoff-brief.md`
3. `feature_list.json`（功能清单和验收状态，找 `passes: false` 的条目确认当前待完成项）
4. `progress.md`（最新轮次的工作记录）
5. `docs/statekit-agent-harness.md`
6. `docs/agent-review-loop.md`
7. `docs/statekit-implementation-blueprint.md`
8. `docs/statekit-block-spec.md`
9. `docs/statekit-docs-site-and-qa-spec.md`
10. `docs/交接/TODO.md`

## 当前项目事实

- StateKit 是面向 SaaS 产品的 category-first 状态 UI 组件库，不是通用组件库。
- 当前主线是 Vue 3 monorepo。
- 公开入口保持为 7 个 category-first 组件：`EmptyState`、`OnboardingState`、`LoadingState`、`ErrorState`、`PermissionState`、`UpgradeState`、`SuccessState`。
- 底层 preset recipe 当前是 21 个，新增场景时优先扩 recipe，不优先新增顶层公开组件。
- `packages/shared` 是类型和 recipe metadata 的事实来源。
- `packages/vue` 是组件实现、导出和默认样式。
- `apps/docs` 是文档站，也是 Playwright QA 的主要测试目录。
- `examples/vite-vue-admin` 是真实集成叙事示例，并由 Playwright 作为运行态集成面覆盖。

## 推荐修改顺序

1. 先改 `packages/shared`
2. 再改 `packages/vue`
3. 再改 `apps/docs`
4. 再改 `examples/vite-vue-admin`
5. 最后同步 README、package README、`docs/交接/CHANGELOG.md`、`docs/交接/TODO.md` 和 launch checklist

不要先改 docs 文案，再回头猜实现应该是什么。

## 常用命令

- 首次初始化：`.\init.ps1`
- 安装依赖：`npm install`
- 框架依赖边界：`npm run lint:boundaries`
- 类型检查：`npm run typecheck`
- 单元测试：`npm run test:unit`
- 文档站 UI 测试：`npm run test:ui`
- 构建：`npm run build`
- 包内容检查：`npm run pack:check`
- 外部安装烟测：`npm run smoke:install`
- 快速验证：`npm run verify:fast`
- 发布前完整验证：`npm run verify:release`
- 生成审查输入包：`npm run review:bundle`

## 工作规则

- 修改前先读相关源码、现有测试和对应文档。
- 保持小步改动，不做无关重构。
- 如果新增或调整公开行为，必须同步 docs、README 和交接文档。
- 如果测试失败，先说明失败原因和失败命令，再判断是否需要改测试。
- 不要回退用户已有改动。
- 不要修改密钥、`.env`、`node_modules`、`dist`、测试结果目录或无关生成物。
- UI 选择器优先使用稳定 `data-testid`，不要依赖长文案选择器。
- 涉及 docs、example、路由、响应式、onboarding 或可见交互时，自动化测试后还要用 Playwright MCP 和 Chrome DevTools MCP 做一次真实浏览器交互检查，并记录 URL、视口、点击路径、console/network 结果和截图位置。

## Review Loop

涉及公开 API、recipe/category、docs 示例、发布链路或跨 workspace 改动时，按 `docs/agent-review-loop.md` 选择 Standard 或 Release Review。

审查前运行：

```bash
npm run review:bundle
```

把 `.agent/review-bundle.md`、任务目标和验证结果交给 Reviewer Agent。Reviewer 只做审查，不直接重写实现。

## 完成标准

普通实现任务至少运行：

```bash
npm run verify:fast
```

涉及 docs 站、示例页、路由、响应式或 onboarding 视觉语义时，再运行：

```bash
npm run test:ui
```

并补充执行浏览器 MCP 交互检查：

- Playwright MCP：打开 docs 或 example，点击关键 CTA，切换桌面/手机视口，检查无横向溢出和状态变化。
- Chrome DevTools MCP：检查真实页面的 accessibility snapshot、console、network，并保存必要截图到 `.agent/`。

涉及发版、公开 API、包内容或 README 口径时，运行：

```bash
npm run verify:release
```
