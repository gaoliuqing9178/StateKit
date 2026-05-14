# QA Reports

这个目录存放每一轮 sprint 的独立 Evaluator 子代理验收报告。

## 文件命名

```
qa/<sprint-id>-evaluator-report.md
```

`<sprint-id>` 与 `feature_list.json` 中 `evidence.qa_report` 字段保持一致，建议格式：

- 单功能轮次：直接用 `feature_list.json` 的 `id`，例如 `qa/version-0-3-0-release-evaluator-report.md`
- 多功能轮次：用 `sprint-NN-<short-name>`，例如 `qa/sprint-08-onboarding-followup-evaluator-report.md`
- Hotfix：在原报告基础上加后缀 `-hotfix.md`

## 必填段落

每份报告必须包含：

1. **任务范围**：本轮验证哪些 `feature_list.json` 条目。
2. **执行环境**：Node 版本、操作系统、是否 Codex 终端。
3. **运行命令清单**：粘贴 `npm run verify:fast` / `verify:ui` / `verify:release` 的输出摘要。
4. **Browser MCP 交互记录**（涉及 UI 时）：URL、视口、点击路径、截图路径。
5. **`## 控制台日志审查`**（涉及 UI 时）：照抄 `docs/quality.md §7.2` 模板，逐条判定 error / warning。
6. **放行建议**：PASS / FAIL / CONDITIONAL_PASS（带条件）。

## Evaluator 资格

按 `docs/agent-review-loop.md` 的角色定义：

- Evaluator **必须**是独立子代理（用 `Agent` 工具 spawn），不能由 Builder 自己写。
- 同一个 Codex agent 不能既写代码又跑 Browser MCP（详见 `docs/statekit-agent-harness.md` 第 4 节）。
- Light Review 级别（仅 harness/文档）允许 Builder 自评，但 `evaluator` 字段必须标 `self-verified-by-builder@<日期>`，且不得用于 packages / apps / examples 改动。

## 历史报告

本目录最初为空骨架（2026-05-14 harness-alignment 轮次创建）。下一轮交付前生成第一份报告，建议优先 `version-0-3-0-release`。
