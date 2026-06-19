# StateKit Decision Log

这份文件记录影响架构、公开 API 和产品边界的关键决策，防止后续 agent 或开发者反复推翻已有决定。

每条记录格式：**决策标题**、时间、背景、决策内容、被排除的替代方案、当前状态。

---

## D-001 category-first 公开 API 取代场景名组件

**时间**：2026-04-06（0.2.0）

**背景**

0.1.x 版本的公开 API 是每个场景一个组件名（如 `FirstProjectState`、`NetworkErrorState`），导致 API 随场景数量线性膨胀，消费者很难知道哪个是"正确"的入口。

**决策**

把公开 API 收口到 7 个 category-first 入口（`EmptyState`、`LoadingState`、`ErrorState`、`PermissionState`、`UpgradeState`、`SuccessState`，后加 `OnboardingState`），底层通过 `recipe` prop 选择具体场景。

旧的场景名组件保留为 deprecated compatibility exports，不删除，让消费者可以渐进迁移。

**排除的替代方案**

- 继续按场景名暴露所有组件：会把 API 做散，消费者很难选择入口。
- 用单一通用 `StateBlock` 入口加大量 props：失去 category 语义，不利于文档和 IDE 提示。

**当前状态**：已落地，7 个 category-first 入口，21 个 preset recipes。不要新增第 8 类入口，除非多个高频场景都明显不适合现有 7 个 category。

---

## D-002 monorepo 依赖方向单向约束

**时间**：2026-04-20（harness 建立时）

**背景**

monorepo 里各 workspace 容易互相引用，导致依赖方向混乱，测试和发布时出现意外耦合。

**决策**

定义四层单向依赖：

```
packages/shared（框架中立）
  ↓
packages/vue（Vue 组件层）
  ↓
apps/docs（文档站）
  ↓
examples/vite-vue-admin（消费者示例，只走公开包入口）
```

用 `scripts/check-boundaries.mjs` 机械检查，不靠人工记忆。

错误信息包含 rule / message / fix 三段，agent 看到错误即知道怎么修。

**排除的替代方案**

- 只靠文档约束：agent 不读文档，需要机械约束。
- 使用 eslint-plugin-boundaries 或 dependency-cruiser：当前场景足够简单，自定义脚本更透明可控。

**当前状态**：已落地，`npm run lint:boundaries` 是 `verify:fast` 的第一步。

---

## D-003 onboarding 从 empty 拆出为独立 category

**时间**：2026-04-22（0.3.0 准备）

**背景**

`first-project` 最初放在 `empty` category 里，但 first-run 激活流程（创建 workspace、邀请成员、连接集成）的语义和 "空状态" 明显不同：前者是引导用户完成初始化，后者是内容缺失的占位。

**决策**

把 onboarding 作为独立 category，提供 `OnboardingState` 入口和三个 recipes：`onboarding-workspace`、`onboarding-members`、`onboarding-integration`。

`first-project` 保留在 `empty` category，语义收窄为"工作区已存在但还没有第一个项目"。

**排除的替代方案**

- 把 onboarding recipes 塞进 empty category 用 recipe prop 区分：语义混淆，首次使用者无法直觉选对 category。
- 新增多个独立 onboarding 组件名：回到 D-001 被排除的场景名膨胀路径。

**当前状态**：已随 0.3.0 落地；0.4.0 继续沿用 7 个 category 作为当前上限，后续新增必须经过明确讨论。

---

## D-004 Playwright + Browser MCP 双层 QA 而非纯自动化

**时间**：2026-04-20（harness 建立时）

**背景**

自动化 Playwright 测试可以覆盖路由、断言、移动端断点，但无法检查视觉像素细节、accessibility 感知质量和"用起来对不对"这类主观判断。

**决策**

保留两层 QA：
1. Playwright 自动化：覆盖所有用户路径、断言、移动端布局。
2. Browser MCP 交互 QA：覆盖自动化之外的真实浏览器感知（accessibility snapshot、console/network、截图）。

在 Codex agent 工作流里，Browser MCP 检查**必须由宿主环境另起新 Codex 终端执行**，不能由同一个编码 agent 自己完成（见 `docs/statekit-agent-harness.md` 第 7 节）。

**排除的替代方案**

- 纯 Playwright 自动化，不做 Browser MCP：无法发现按钮没接线、UI 显示成功但后端未写入等运行时问题。
- 纯人工 QA：成本高，不可重复。

**当前状态**：已落地，harness 文档已规范化 Browser MCP 5 步操作规范。无自动化视觉像素级回归，插图细节仍需人工或截图比对确认。

---

## D-005 StateKit 的边界：不做什么

**时间**：持续约束（0.1.0 起）

**背景**

作为面向 SaaS 状态场景的专用组件库，StateKit 容易被要求不断扩展成通用组件库或页面搭建器。

**决策**

以下方向明确不做：

- 不做通用按钮、表单控件、弹窗等通用 UI 组件。
- 不引入复杂 slot 系统或高度自由的页面搭建能力。
- 不新增第三个 CTA。
- 不把 React 适配继续扩张成无限多框架承诺；新增框架适配必须复用 shared 元数据并通过独立 adapter 边界进入。
- 不为每个新增 recipe 单独暴露一个新的顶层公开组件名。
- 不把所有知识塞进 `AGENTS.md`。

**当前状态**：持续约束。任何触碰这些边界的 PR 应在 Review 阶段被阻断。

---

## D-007 React adapter 作为同级 framework adapter 接入

**时间**：2026-06-20

**背景**

用户明确要求补全组件库对 React 的适配。仓库此前的事实源已经拆成 `packages/shared` 元数据层和 `packages/vue` adapter，因此 React 支持不应该通过复制 recipe 数据或让 React 包依赖 Vue runtime 实现。

**决策**

新增 `@statekit-vue/react` workspace，作为与 `@statekit-vue/vue` 同级的 framework adapter：

- `packages/shared` 继续是类型、recipe metadata 和默认文案的唯一事实来源。
- React adapter 导出同样 7 个 category-first 入口和 21 个兼容 preset。
- React adapter 通过 `media` / `actions` props 对应 Vue adapter 的 `#media` / `#actions` slot。
- React adapter 自带 `@statekit-vue/react/styles.css`，不要求消费者安装 Vue 包或 Vue runtime。
- `lint:boundaries`、`typecheck`、`build`、`pack:check` 和 `smoke:install` 都必须覆盖 React adapter。

**排除的替代方案**

- 让 React 包依赖 `@statekit-vue/vue` 只复用 CSS：会把 Vue runtime 间接带进 React 消费者依赖图。
- 把 recipe metadata 复制到 React 包：会制造第二套事实源。
- 把 StateKit 改成通用多框架抽象层：超出当前 category-first 状态组件库边界。

**当前状态**：已落地为 `packages/react`，后续新增 recipe 时需要同步检查 Vue 与 React 两个 adapter 的 preset wrapper、测试和包产物。

---

## D-006 docs 站中文版本使用 docs-local 翻译，不改 shared metadata

**时间**：2026-05-07

**背景**

为国际化 docs 站新增中文版本时，面临两种选择：把中文 copy 放进 `packages/shared` 的 recipe metadata，还是在 docs 本地维护。

**决策**

中文展示层在 `apps/docs/src/lib/` 内维护，不改 `packages/shared/src/block-meta.ts` 的默认 metadata。

原因：
- shared metadata 是框架中立的事实来源，加入语言字段会增加维护复杂度。
- docs-local 翻译只影响展示层，不影响包的公开 API 和消费者。

**排除的替代方案**

- 在 shared metadata 里加 `title_zh`、`description_zh` 等字段：增加 shared 的维护负担，且语言逻辑应属于展示层。

**当前状态**：已落地，`apps/docs/src/lib/` 下有 locale-aware helpers。
