# StateKit Progress

这份文件记录每一轮工作做了什么、为什么这么做、怎么验证，供下一轮接手的 agent 快速定位当前状态。

最新状态见最顶部条目。

---

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
3. 涉及 UI 验证时，按 `docs/statekit-agent-harness.md` 第 7 节的 Codex 测试说明，由宿主环境另起新 Codex 终端执行 Browser MCP 检查。

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
