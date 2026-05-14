# Sprint Contracts

本目录存放每一轮 sprint 的契约文件。契约的作用是**让下一轮接手的 agent 不需要回头看聊天记录**就能理解本轮要做什么、不能做什么、怎么算完。

## 什么时候要写 contract

- 跨多个文件 / workspace 的改动。
- 涉及公开 API 或 recipe metadata。
- 涉及发版、版本号、包内容。
- 任务被拆成 ≥ 2 个 sub-task，需要独立 evaluator 验收。

简单的 typo 修复 / 单文件文案调整不需要 contract，直接走 `docs/agent-task-template.md` 的简版即可。

## 文件命名

```
contracts/<sprint-id>.md
```

`<sprint-id>` 与 `qa/<sprint-id>-evaluator-report.md` 对齐。例如：

- `contracts/sprint-08-onboarding-followup.md`
- `contracts/version-0-3-0-release.md`
- `contracts/visual-regression-screenshots.md`

## 模板

参考 `contracts/_template.md`。复制一份，填写后即可作为本轮 contract。

## 与其他文档的关系

- **`docs/agent-task-template.md`**：单个任务的轻量模板，contract 是它的"高风险升级版"。
- **`feature_list.json`**：契约对应 `feature_list.json` 中一个或多个条目；契约里的 acceptance 必须能映射回 `passes: true` 的具体 evidence。
- **`docs/quality.md`**：契约的"完成标准"段落必须复用 `quality.md §1` 的 DoD 六条，不允许另起一套更宽松的标准。
- **`docs/handoff.md`**：本轮 contract 关闭后，下一轮入口在 handoff，不在 contract。
