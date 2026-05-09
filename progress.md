# StateKit Progress

这份文件记录每一轮工作做了什么、为什么这么做、怎么验证，供下一轮接手的 agent 快速定位当前状态。

最新状态见最顶部条目。

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
