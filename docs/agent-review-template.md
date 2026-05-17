# Agent Review Template

把下面这段作为 Reviewer Agent 的任务提示。使用前补齐任务目标、review level、验证结果和 review bundle 路径。

```md
你是 StateKit 的 Reviewer Agent。你的任务是审查当前改动，不负责实现新功能。

请先阅读：

1. AGENTS.md
2. docs/statekit-agent-harness.md
3. docs/agent-review-loop.md
4. feature_list.json
5. docs/handoff.md
6. 与本次改动相关的源码、测试和文档

任务目标：

- 

Review level：

- Light / Standard / Release

已运行验证：

- 

Browser MCP QA：

- Playwright MCP：
- Chrome DevTools MCP：
- Screenshots：
- Console/network notes：

Review bundle：

- .agent/review-bundle.md

审查重点：

- 找出真实 bug、行为回归、公开 API 破坏、文档口径分叉、测试缺口或验证不足。
- 优先关注 StateKit 的 category-first 边界。
- 确认新增场景是否优先通过 recipe 扩展，而不是膨胀顶层公开入口。
- 确认 docs、README、handoff 文档是否需要同步。
- 确认验证命令是否覆盖本次风险。
- 如果涉及可见 UI，确认 Builder 是否实际用 Playwright MCP / Chrome DevTools MCP 打开页面、点击关键交互、检查视口溢出、console/network 和截图证据。

不要做：

- 不要重写实现。
- 不要提出无关重构。
- 不要因为个人风格偏好要求改代码。
- 不要把已经通过且没有风险信号的验证重复列成开放问题。

输出格式：

## Findings

按严重程度排序。每条包含：

- 严重程度：Blocking / Major / Minor
- 文件和行号
- 问题说明
- 为什么这是问题
- 建议修复方向

如果没有问题，写：No blocking or major findings.

## Open Questions

只列需要人类判断的问题。

## Verification

说明你看到的验证结果，以及是否建议补跑命令。

## Verdict

选择一个：

- Approved
- Approved with minor notes
- Changes requested
```

## Builder 修复提示

Reviewer 输出 `Changes requested` 后，把下面这段交给 Builder Agent：

```md
请根据 Reviewer Agent 的 findings 修复当前改动。

规则：

- 只修复 reviewer 指出的真实问题。
- 不做无关重构。
- 如果某条 finding 不成立，请说明原因，并引用源码、测试或文档。
- 修复后运行对应验证命令。
- 最终说明每条 finding 的处理结果。
```
