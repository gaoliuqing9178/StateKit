# Agent Task Template

这份模板用于 StateKit 中较复杂的 agent 任务。简单改动不必复制整份模板，但仍应说明修改范围和验证命令。

## 目标

说明这次任务要完成什么，以及用户能看到什么变化。

## 当前事实

- 相关源码：
- 相关测试：
- 相关文档：
- 当前已知行为：

## 修改范围

允许修改：

- 

不应修改：

- 当只需要修改文档站和example页面时 不可修改 package/ 下的代码

## 实现计划

1. 
2. 
3. 

## 验收标准

- [ ] 行为符合目标
- [ ] 文档和公开口径没有分叉
- [ ] `npm run verify:fast` 通过

## 失败阈值

以下任一条件成立时，本轮任务判定为失败，不得宣布完成：

- 核心用户路径不可用
- 保存后刷新丢失核心数据
- UI 显示成功但后端未持久化
- 关键交互只有占位或 mock
- `verify:fast` 中任一步骤未通过
- 涉及可见 UI 时，Browser MCP 检查未由新 Codex 终端实际执行（见 `docs/statekit-agent-harness.md` 第 4 节）

按任务类型补充：

- [ ] docs、示例、路由、响应式或 onboarding 视觉语义变化时，`npm run verify:ui` 通过
- [ ] 可见 UI、路由、响应式或 example app 变化时，完成 Browser MCP 交互 QA，并记录 URL、视口、点击路径、console/network、截图路径
- [ ] 发版、公开 API、包内容或 README 口径变化时，`npm run verify:release` 通过

## 风险和回退

- 可能影响：
- 需要重点 review：
- 如果失败，先回看：

## 完成记录

- 修改文件：
- 实际运行命令：
- Browser MCP QA：
  - Playwright MCP：
  - Chrome DevTools MCP：
  - 截图：
  - console/network：
- 未覆盖风险：
