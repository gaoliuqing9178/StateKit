# Sprint Contract · <sprint-id>

> 复制本文件为 `contracts/<sprint-id>.md`，填好之后再开工。开工前未填的字段在本轮交付前必须补齐。

## 1. 范围（必填）

- **目标**：一句话说清楚本轮要交付什么用户可见结果。
- **对应 `feature_list.json` 条目**：列出本轮会把哪些条目从 `passes: false` 改成 `true`，或新增哪些条目。
- **不在范围内**：明确写出本轮**不**做什么，避免范围蔓延。

## 2. 当前事实（必填）

- 相关源码：
- 相关测试：
- 相关 docs：
- 当前已知行为 / 约束：

## 3. 修改面（必填）

允许修改：

- `packages/...`
- `apps/docs/...`
- `examples/...`
- `docs/...`

不应修改：

- 已 `passes: true` 且与本轮无关的 `feature_list.json` 条目
- 不在本轮范围的 workspace（按 `docs/statekit-implementation-blueprint.md` 的修改顺序判定）
- `node_modules`、`dist`、`test-results`

## 4. 实现计划（必填）

按 `packages/shared → packages/vue → apps/docs → examples → README/CHANGELOG/handoff` 顺序拆步骤：

1. 
2. 
3. 

## 5. 验收标准（必填）

最低线（与 `docs/quality.md §1` 对齐）：

- [ ] `feature_list.json` 对应条目 `passes: true` + `evaluator` + `evidence`
- [ ] `npm run verify:fast` 全绿（涉及 UI 时再补 `verify:ui`，发版时补 `verify:release`）
- [ ] `progress.md` 新增本轮日志
- [ ] `docs/handoff.md` 已写"下一轮 agent 应该先做"

按任务类型补充：

- [ ] 涉及 UI / 路由 / 响应式 / onboarding 视觉：Browser MCP 交互 QA 完成（URL、视口、点击路径、截图、console / network）
- [ ] 涉及公开 API / recipe / category：`docs/decision-log.md` 已记录决策
- [ ] 涉及发版：`pack:check` + `smoke:install` + `qa/<sprint-id>-evaluator-report.md` 全部就位

## 6. 失败阈值（必填）

以下任一成立即判失败（与 `docs/quality.md §3` 一致）：

- 7 个 category-first 入口任意一个核心 recipe 渲染失败
- docs 主路径 / 中文 locale / example app onboarding 链路任意一条断裂
- 移动端 ≤ 760px 出现横向溢出
- `verify` 任一步红
- Evaluator 报告缺 `## 控制台日志审查` 或阻塞 warning 被判"不影响"

## 7. 风险与回退（建议填）

- 可能影响：
- 需要重点 review：
- 失败时回滚策略：

## 8. 完成记录（交付前回填）

- 修改文件：
- 实际运行命令：
- Browser MCP QA：
  - Playwright MCP：
  - Chrome DevTools MCP：
  - 截图：
  - console / network：
- Evaluator 报告：`qa/<sprint-id>-evaluator-report.md`
- 未覆盖风险：
