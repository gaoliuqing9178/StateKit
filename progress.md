# StateKit Progress

这份文件记录每一轮工作做了什么、为什么这么做、怎么验证，供下一轮接手的 agent 快速定位当前状态。

最新状态见最顶部条目。本文件不替代 `docs/handoff.md`：handoff 只写**当前**状态，progress 留**全部**历史。

---

## 2026-05-17 visual-regression-screenshots

**这轮做了什么**

- 新增 `apps/docs/tests/visual-regression-screenshots.spec.ts`，覆盖三个已知视觉回归点：
  - `/recipes/page-error-state`：error cross 两条线相对 `.sk-figure--error` X/Y 居中，并截图比对 `error-cross-centered.png`。
  - `/recipes/no-permission-state`：permission lock body / arch 相对 `.sk-figure--permission` X 轴居中，arch 与 body 连接关系合理，并截图比对 `permission-lock-centered.png`。
  - `/recipes/task-success-state`：success figure 不再渲染 `.sk-figure__shadow-line`，并截图比对 `success-without-shadow-line.png`。
- 新增三张截图基线到 `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/`。
- 更新 `playwright.config.ts` 的 `snapshotPathTemplate`，去掉平台后缀，避免本机和 CI 生成不同 snapshot 文件名。
- 更新 `.gitignore`，继续默认忽略普通 PNG，但允许提交 `apps/docs/tests/__screenshots__/**/*.png` 这类 Playwright 基线。
- 独立 Evaluator 已写 `qa/visual-regression-screenshots-evaluator-report.md`，结论 PASS，并包含控制台日志审查。
- `feature_list.json` 中 `visual-regression-screenshots` 已补 `passes: true`、`evaluator` 和 `evidence`。

**为什么这么做**

这轮目标不是重做视觉样式，而是把 error / permission / success 三处插图修复点固定成 CI 可重复的回归保护。测试只截 `.sk-shell__media-frame`，截图里没有正文文本，配合固定 viewport、禁用动画/caret、等待 `document.fonts.ready`、`scale: "css"` 和有限像素容忍，降低字体抗锯齿和页面布局差异带来的误报。

**这轮验证结果**

```
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts --update-snapshots ✅ 3 passed
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts                    ✅ 3 passed
npm run verify:fast                                                                                              ✅
npm run verify:ui                                                                                                ✅ 39 passed
Evaluator: .\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts         ✅ 3 passed
Evaluator: npm run verify:ui                                                                                     ✅ 39 passed
```

**控制台日志审查 / Browser QA 记录**

按 `docs/statekit-agent-harness.md`，Builder 本轮没有自己宣称 Browser MCP 通过；独立 Evaluator 用 Playwright `page.on("console")` / `page.on("pageerror")` 抽查了三条目标路由：

| 路由 | console error | console warning | pageerror | 结论 |
| --- | ---: | ---: | ---: | --- |
| `/recipes/page-error-state` | 0 | 0 | 0 | PASS |
| `/recipes/no-permission-state` | 0 | 0 | 0 | PASS |
| `/recipes/task-success-state` | 0 | 0 | 0 | PASS |

**当前状态**

- `visual-regression-screenshots` 已完成。
- 用户本轮说明 `v0.3.0` 已经发版；本轮没有追溯 release 证据，也没有把 `version-0-3-0-release` 改成 true。下一轮如果要关闭该条目，应只补 evidence / evaluator，不要重复 publish。

---

## 2026-05-17 Docs 交接清理

**这轮做了什么**

- 删除 `docs/statekit-ai-handoff-brief.md`，因为当前交接职责已经由 `docs/handoff.md`、`feature_list.json` 和 `progress.md` 承担。
- 保留 `docs/交接/TODO.md` 的删除状态，并把仍指向它的 review / harness / AGENTS 引用改到 `feature_list.json` 与 `docs/handoff.md`。
- 更新 `docs/README.md`、`docs/statekit-agent-harness.md`、`docs/agent-review-loop.md`、`docs/agent-review-template.md`、`AGENTS.md`、`CONTRIBUTING.md` 和 `docs/statekit-launch-checklist.md` 的旧交接口径。
- 修正 `docs/statekit-block-spec.md` 中 19 个旧 Block 的过期描述，改为当前 21 个 preset recipe，并补齐 `onboarding-members` 与 `onboarding-integration`。

**为什么这么做**

`feature_list.json` 已经是功能状态和验收 evidence 的结构化事实来源，`docs/handoff.md` 只保留当前轮次状态，`progress.md` 保留历史。继续保留旧 handoff brief 和 TODO 会让下一轮 agent 同时看到多套互相冲突的交接入口。

**这轮验证结果**

```
引用残留搜索              ✅ 仅剩 handoff 中的清理说明，以及 CHANGELOG 里的历史 0.2.0 记录
npm run verify:fast       ✅
```

**当前状态**

- `version-0-3-0-release` 仍是 `feature_list.json` 中第一个 `passes: false` 的条目。
- `visual-regression-screenshots` 仍是第二个 `passes: false` 的条目。
- `docs/statekit-launch-checklist.md` 暂时保留为 release 辅助清单；如果下一轮创建 `contracts/version-0-3-0-release.md`，应把 checklist 中未完成的人工检查项映射进 contract。

---

## 2026-05-14 Harness 对齐 AI-Visualization 框架

**这轮做了什么**

按 `H:\AI-Visualization` 的 harness 框架反向对齐，补齐 StateKit 缺失的"证据闭环 + 单一门禁 + 流程闭环"三件事：

- **新增 `docs/quality.md`**：把 DoD 六条硬指标、§7 Evaluator 控制台日志审查规程、StateKit 默认 console 噪音分级表（套 StateKit 实际场景：vue hydration / favicon 404 / vue-router no match / extraneous attrs / a11y warning / vite preload）落地。
- **新增 `docs/handoff.md`**：替代以前散落在 `statekit-ai-handoff-brief.md` 与 `progress.md` 之间的"下一轮先做什么"，做成单一交接入口。
- **新增 `verify.ps1`**：PowerShell 单一门禁，串行跑 boundaries / typecheck / test:unit / build / test:ui / pack:check / smoke:install。支持 `-Mode fast | ui | release`，结尾打印 `VERIFY OK`。
- **新增 `contracts/`** 目录：`README.md` + `_template.md`，给跨多文件 / 跨 workspace 改动用的 sprint contract 模板。
- **新增 `qa/`** 目录：放独立 Evaluator 子代理报告，README 写明命名规则与必填段落。
- **新增 `docs/runbooks/debug.md`**：把冷启动 / verify 链 / 运行时 / Browser MCP 的零散排障收成入口。
- **重构 `feature_list.json`**：补 `meta` 段（spec_version: v0.2、schema_doc）、为每条历史 `passes: true` 条目补 `evaluator` + `evidence` 字段（按"全部回填到能查到的证据路径"原则，从 `progress.md` / `.agent/` / 测试目录回填可复现路径），未在历史归档独立 evaluator 报告的条目用 `unverified-legacy: true` 兼容标记。新增 `harness-alignment` 条目记录本轮自身。
- **重写 `AGENTS.md`**：改成"地图"风格，2 分钟阅读量，按 AI-Visualization 风格重写"开工前先读"、"禁区"、"什么叫完成"、"分层快查"、"每轮只做一件事"等小节。

**为什么这么做**

StateKit 之前的 harness 在边界 lint / Browser MCP / Codex 测试分工上做得很扎实，但缺三件事：

1. **DoD 没有强约束**：`feature_list.json` 的 `passes: true` 没有强制配 evaluator + evidence 字段，agent 可以悄悄改 true 而不留证据。
2. **单一门禁**：`verify:fast` / `verify:release` 是 npm script 串接，但没有 PowerShell 入口，发版前没有"贴 VERIFY OK 即放行"的最后一关。
3. **流程闭环**：没有 `contracts/` 把跨多文件改动收成契约，也没有 `qa/` 把 evaluator 报告固化路径。

AI-Visualization 通过 `feature_list.json` 的 `meta` + `evaluator` + `evidence` 三件套，把这三个缺口都补上了。这一轮把同样的机制反向移植到 StateKit。

**这轮验证结果**

本轮属 Light Review（仅 harness/文档层，未触碰 `packages/`、`apps/docs/src/`、`examples/`），按 `docs/quality.md §1` 不强制走 Browser MCP。

```
docs review                 ✅（quality / handoff / debug / contracts / qa README 自检通过）
AGENTS.md 入口可读性         ✅（2 分钟阅读量内）
verify:fast                 ⏸ 待下一轮触发功能改动时跑
verify:ui / release         ⏸ 待 version-0-3-0-release 时跑
```

**当前状态**

- `feature_list.json` 12 项：8 项 `passes: true`（全部带 `evaluator` + `evidence`，其中 7 项标 `unverified-legacy: true`），2 项 `passes: false`（`version-0-3-0-release`、`visual-regression-screenshots`），1 项本轮自身已 `passes: true`。
- 下一轮 evaluator 可优先 `version-0-3-0-release`，按 `contracts/_template.md` 写契约 + `.\verify.ps1 -Mode release` + 写 `qa/version-0-3-0-release-evaluator-report.md`。

**下一轮接手建议**

详见 `docs/handoff.md` 末尾"下一轮 agent 应该先做"。

---

## 2026-05-09 Onboarding recipe 插槽示例与 media stat 边界修复

**这轮做了什么**

- 更新 `apps/docs/src/views/RecipeDetailView.vue`，让 onboarding recipe 详情页的 live preview 使用真实 `#media` 和 `#actions` 插槽，而不是只展示默认 CTA。
- 新增 `recipeOnboardingSlotSnippet`，在 onboarding recipe 详情页补出可复制的 media/action 插槽代码示例。
- 更新 `apps/docs/src/lib/detail-copy.ts`，补充中英文插槽示例说明。
- 修复 `packages/vue/src/styles/base.css` 中 `.sk-onboarding-media__stat strong` 的长文本溢出问题，避免 `Workspace` 这类非数字值超出 stat 卡片。
- 扩展 `apps/docs/tests/recipes-navigation.spec.ts` 和 `apps/docs/tests/mobile-layout.spec.ts`，覆盖 onboarding slot preview、slot snippet，以及 stat value 不越出卡片边界。

**为什么这么做**

onboarding 本来就应该比普通状态块更像一次性激活入口。只在文案里说支持插槽不够，recipe 详情页需要直接展示 richer media 和 layered actions，用户才会直观看到它和 EmptyState / ErrorState 这类组件的差异。

**这轮验证结果**

```
npm run typecheck --workspace @statekit/docs      ✅
npm run typecheck --workspace @statekit-vue/vue   ✅
npm run test:ui -- apps/docs/tests/recipes-navigation.spec.ts apps/docs/tests/mobile-layout.spec.ts ✅
npm run verify:fast                              ✅
npm run test:ui                                  ✅
Playwright MCP                                   ✅
Chrome DevTools MCP                              ✅
```

**Browser MCP 记录**

- Playwright MCP: `http://127.0.0.1:4173/recipes/onboarding-workspace-state`
- 视口: desktop `1252x879`
- 检查点: live preview 中 `#media` / `#actions` 均存在；`Open full activation example` 可跳转到 `/examples/onboarding-activation`；`Workspace` stat value 未越出卡片右边界。
- 截图: `.agent/docs-onboarding-recipe-desktop-fixed.png`
- Chrome DevTools: accessibility snapshot 可读；`document/script/stylesheet` 请求为 200/304；console 无 error/warn；截图为 `.agent/chrome-devtools-onboarding-recipe-fixed.png`

---

## 2026-05-08 P1 场景矩阵与 docs 文案收口

**这轮做了什么**

- 新增 `docs/statekit-scenario-gap-matrix.md`，把 `category × 用户阶段（start / operate / blocked / recover / finish）` 的现状、缺口和下一步判断放到一张可复用矩阵里。
- 新增 `apps/docs/src/lib/category-docs.ts`，把 docs 站里手写的分类标签、分类说明和 category 级 usage guide 收到单一 docs-local 数据层。
- 更新 `apps/docs/src/views/HomeView.vue`、`apps/docs/src/views/RecipesView.vue`、`apps/docs/src/views/RecipeDetailView.vue`，让首页、列表页和详情页都从同一份分类数据读取 label / description / guide。
- 同步更新 `docs/README.md`、`docs/statekit-ai-handoff-brief.md`、`docs/statekit-agent-harness.md`、`docs/交接/TODO.md` 和 `feature_list.json`，把矩阵和收口状态写回交接入口。

**为什么这么做**

P1 要求的两个方向其实是一件事的两面：先把下一批扩展的判断标准摆清楚，再把 docs 站里零散的分类文案收口成单一来源。这样后续新增 recipe 时，至少不会再手动改三四个页面却漏掉一个入口。

**这轮验证结果**

```
npm run typecheck --workspace @statekit/docs  ✅
npm run verify:fast                          ✅
npm run test:ui                              ✅
Playwright MCP                               ✅
Chrome DevTools MCP                          ✅
```

**Browser MCP 记录**

- Playwright MCP: `http://127.0.0.1:4173/` → `/recipes` → `/recipes/onboarding-workspace-state`
- 视口: desktop 默认视口，`window.innerWidth = 1707`；mobile `390x844`
- 点击路径: 首页 `Browse recipes` → recipes 列表 → `onboarding-workspace` 详情页
- 无横向溢出: desktop `true`，mobile `true`
- 截图: `.agent/docs-recipe-detail-mobile.png`
- Chrome DevTools: 详情页 `accessibility snapshot` 正常，`document/script/stylesheet` 请求均为 200/304；console 只有 `favicon.ico` 404 这一条非业务错误

## 2026-05-08 Harness 缺口补全

**这轮做了什么**

按 `conclusion.md` 的 harness 标准，审查仓库 harness 合格性，并补全以下缺口文件：

- 新增 `feature_list.json`：从 `docs/交接/TODO.md` 迁移功能清单，加入 `passes` 状态字段，作为 agent 可读的验收状态事实来源。
- 新增 `progress.md`（本文件）：建立轮次记录机制，避免 agent 重启后只靠聊天记录。
- 新增 `docs/decision-log.md`：把散落在 CHANGELOG 里的架构决策提取为独立查阅入口，防止后续 agent 反复推翻已有决定。
- 新增 `init.ps1`：Windows 环境一键恢复开发环境。
- 更新 `docs/statekit-agent-harness.md`：补充 Codex 测试场景下宿主环境启动新终端的说明，明确"同一个 agent 不能自己写代码又自己跑 Browser MCP 测试"这条约束。
- 更新 `docs/agent-task-template.md`：补充"失败阈值"字段，对应 `conclusion.md` Sprint contract 要求。
- 更新 `AGENTS.md`：在先读顺序中加入 `feature_list.json` 和 `progress.md`，在常用命令中加入 `init.ps1`。

**为什么这么做**

`conclusion.md` 定义了最小 harness 结构清单。本仓库已有的 harness 在边界 linter、双 agent review loop、分层验证命令、Browser MCP 规范方面做得很扎实，但缺少文件级交接系统（`feature_list.json` + `progress.md`）和 Windows 快速恢复入口（`init.ps1`）。

**这轮验证结果**

harness 文件本身不需要跑 verify 命令（属于 Light Review 级别，不影响运行时代码）。

**当前状态**

- `feature_list.json` 已创建，包含 11 个功能项，8 个 `passes: true`，3 个 `passes: false`（待完成）。
- `0.3.0` 发版验证是当前最高优先级未完成项（`feature_list.json` 中 id: `version-0-3-0-release`）。

**下一轮接手建议**

1. 读 `feature_list.json`，找 `passes: false` 的条目。
2. 最高优先级是 `version-0-3-0-release`：跑 `npm run verify:release`，确认全部通过后发布 npm。
3. 涉及 UI 验证时，按 `docs/statekit-agent-harness.md` 第 4 节的 Codex 测试说明，由宿主环境另起新 Codex 终端执行 Browser MCP 检查。

---

## 2026-05-07 中文 Docs Locale（已验证）

**这轮做了什么**

- 新增 `/zh-CN` 路由家族，覆盖首页、recipes、recipe 详情、安装页和示例页入口。
- 新增顶部语言切换，保留当前页面路径。
- 新增 `apps/docs/tests/chinese-locale.spec.ts`。

**验证结果**

```
npm run typecheck --workspace @statekit/docs  ✅
npm run build --workspace @statekit/docs      ✅
npm run test:ui                               ✅
```

---

## 2026-05-04 0.3.0 Release Prep（验证中）

**这轮做了什么**

- 版本线切到 0.3.0。
- onboarding recipe family 扩展到 3 个（workspace / members / integration）。
- docs 和 example 同步到 7 类 / 21 recipes 新口径。

**验证结果**

```
npm run typecheck  ✅
npm run build      ✅
npm run test:unit  ✅
npm run test:ui    ✅
npm run pack:check ✅
npm run smoke:install  ⏳ 待在最终发版口径定稿后补跑
```

**当前阻塞**

`smoke:install` 待补跑，`version-0-3-0-release` 未完成（见 `feature_list.json`）。
