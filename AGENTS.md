# AGENTS.md · StateKit

> 这是一张**地图**，不是百科全书。读完大约 2 分钟，然后按链接深入 `docs/`。
> 不要把所有细节塞进这里。细节在 `docs/`，事实在源码。

## 这是什么

StateKit 是一个面向 SaaS 产品的 **category-first** 状态 UI 组件库（shared metadata + Vue / React adapter monorepo），聚焦 empty / onboarding / loading / error / permission / upgrade / success 这 7 类状态页与流程节点，**不是**通用组件库或页面搭建器。

## 开工前先读（严格按序，别跳）

1. `docs/README.md` —— 文档目录与阅读顺序
2. `feature_list.json` —— 功能清单和验收状态（找第一个 `passes: false` 的条目）
3. `docs/handoff.md` —— **上一轮 agent 留给你什么**（最重要）
4. `progress.md` —— 最近几轮发生过什么，避免重复踩坑
5. `docs/quality.md` —— DoD 六条硬指标 + Console 日志审查规程
6. `docs/statekit-agent-harness.md` —— Codex 测试分工 / Browser MCP 规则
7. 本轮如果有 contract，再读 `contracts/<sprint-id>.md`

## 当前项目事实

- 公开入口保持 7 个 category-first 组件：`EmptyState`、`OnboardingState`、`LoadingState`、`ErrorState`、`PermissionState`、`UpgradeState`、`SuccessState`。
- 底层 preset recipe 当前 21 个，新增场景**优先扩 recipe，不优先新增顶层公开组件**。
- 本地版本线 `0.3.0`（npm 已发布的最新是 `0.2.1`）。
- `packages/shared` 是类型与 recipe metadata 的事实来源；`packages/vue` 和 `packages/react` 是 framework adapter；`apps/docs` 是文档站 + Playwright 主测试目录；`examples/vite-vue-admin` 是 Vue 真实集成示例。

## 常用命令

```
.\init.ps1                # 冷启动：node 检查 + 依赖安装 + verify:fast 抽样
.\verify.ps1              # 全量验证（默认 release 七步；可 -Mode fast / -Mode ui）
npm run dev:docs          # 文档站（127.0.0.1:4173）
npm run dev:example       # 示例 app（127.0.0.1:4273）
npm run verify:fast       # boundaries + typecheck + test:unit + build
npm run verify:ui         # 加跑 Playwright（docs + example）
npm run verify:release    # 加跑 pack:check + smoke:install
npm run lint:boundaries   # workspace 依赖方向机械检查
npm run review:bundle     # 生成 .agent/review-bundle.md 给 Reviewer
```

**Browser MCP 视觉抓手**（涉及可见 UI / 路由 / 响应式 / onboarding / example app 时必须走）：
打开页面 → `take_snapshot` 看 DOM → 走 Golden Path → `list_console_messages` 按 `docs/quality.md §7` 判定 → `take_screenshot` 存到 `.agent/`。**同一个 Codex agent 不能既写代码又跑 Browser MCP**（详见 `docs/statekit-agent-harness.md` 第 4 节）。

**Evaluator 子代理验收**（Standard / Release 级别 DoD 放行闸）：交付前必须用 `Agent` 工具 spawn 独立子代理跑 QA，产物落 `qa/<sprint-id>-evaluator-report.md`；`feature_list.json` 的 `passes: true` 必须伴随 `evaluator` + `evidence` 字段。详见 `docs/quality.md §1`。

详细排障见 `docs/runbooks/debug.md`。

## 禁区（触碰即 3.25）

- **禁止修改 `feature_list.json` 中已 `passes: true` 的验收标准**来让自己显得完成
- **禁止删减或弱化 `steps` / `verified_by` 字段** —— 只允许补充更严格的验证
- **禁止用 `any` 和 `@ts-ignore`**（lint 会直接报错）
- **禁止跨 workspace 直接 import 源码** —— `apps/docs` / `examples/vite-vue-admin` 必须走 `@statekit-vue/vue` 公开入口；`packages/react` 必须走 `@statekit-vue/shared`，不能依赖 Vue；`packages/shared` 框架中立，不依赖 Vue / React
- **禁止 `console.log`、`debugger` 留在 `packages/`、`apps/docs/src/`、`examples/`**（测试和脚本例外）
- **禁止"我改好了"却不跑 verify 就说完成**
- **禁止绕过 Evaluator 子代理**直接把 `passes` 改成 `true`
- **禁止 evaluator 报告省略 `## 控制台日志审查` 段落**（涉及 UI 时）—— 任何阻塞 console error / warning 必须直接 FAIL
- **禁止删 / 弱化 lint:boundaries、Playwright 断言、`pack:check` 包内容验收来让构建过绿** —— 规则是地基，动地基是作弊
- **禁止跳过 `.\init.ps1` 直接手工 npm install** —— init 是下一轮 agent 的入口
- **禁止把 StateKit 扩成通用组件库 / 页面搭建器 / 多框架库 / 每场景一个公开组件名**

## 什么叫完成（Definition of Done）

一个功能真正"完成"必须**同时**满足六条（详见 `docs/quality.md §1`）：

1. `feature_list.json` 对应项 `passes: true` + `evaluator` + `evidence` 字段齐全
2. Evaluator 独立子代理放行建议 PASS（Standard / Release 级别）
3. Evaluator 报告含 `## 控制台日志审查`（涉及 UI 时）
4. `npm run verify:fast` 全绿（涉及 UI 时再跑 verify:ui，发版时再跑 verify:release）
5. `progress.md` 新增本轮日志（做了什么 / 为什么 / 怎么验证 / Browser MCP 记录）
6. `docs/handoff.md` 已更新到下一轮可接手状态

## 分层快查（详见 `docs/statekit-implementation-blueprint.md`）

```
packages/shared       共享类型 + recipe metadata（框架中立）
packages/vue          Vue 组件层（StatePresetBlock / StateBlockShell + 7 个 category 入口）
packages/react        React 组件层（StatePresetBlock / StateBlockShell + 7 个 category 入口）
apps/docs             文档站（Playwright 主测试目录）
examples/vite-vue-admin  真实消费者示例（只走 @statekit-vue/vue 公开入口）
```

依赖方向：`shared → vue → docs / examples` 与 `shared → react` 两条适配线，反向禁止，跨 workspace 源码穿透禁止。`npm run lint:boundaries` 机械检查这些规则。

## 推荐修改顺序

1. 先改 `packages/shared`（类型 / recipe metadata）
2. 再改具体 adapter：`packages/vue` 或 `packages/react`（组件实现 / 默认样式）
3. 再改 `apps/docs`（文档站）
4. 再改 `examples/vite-vue-admin`（Vue 真实集成）
5. 最后同步 README、`packages/*/README.md`、`docs/交接/CHANGELOG.md`、`docs/handoff.md`、`feature_list.json`、`docs/statekit-launch-checklist.md`

不要倒过来先改 docs 文案，再回头猜实现应该是什么。

## 每轮只做一件事

每一轮 agent **只挑 `feature_list.json` 里优先级最高且 `passes: false` 的一项**推进，不要多、不要贪。每轮结束保持仓库干净可接手。

当前推进目标见 `docs/handoff.md` 末尾"下一轮 agent 应该先做"。

## Review Loop

涉及公开 API、recipe / category、docs 示例、发布链路或跨 workspace 改动时，按 `docs/agent-review-loop.md` 选择 Light / Standard / Release Review。

审查前运行：

```bash
npm run review:bundle
```

把 `.agent/review-bundle.md`、任务目标、验证结果交给 Reviewer Agent。Reviewer 只做审查，不直接重写实现。

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **StateKit-Vue** (1145 symbols, 1663 relationships, 47 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/StateKit-Vue/context` | Codebase overview, check index freshness |
| `gitnexus://repo/StateKit-Vue/clusters` | All functional areas |
| `gitnexus://repo/StateKit-Vue/processes` | All execution flows |
| `gitnexus://repo/StateKit-Vue/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
