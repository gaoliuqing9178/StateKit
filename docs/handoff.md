# Handoff · 给下一轮 agent 的交接书

> **规则**：每一轮 agent 结束前必须更新本文件。下一轮 agent 拿到仓库，**第一件事就是读这里**（`AGENTS.md` 入口顺序的第 4 步）。
>
> 本文件只保留**当前**轮次状态。历史轮次留在 `progress.md`。

---

## 当前状态

**更新时间**：2026-06-20  
**交接人**：release-prep generator  
**仓库基线**：`@statekit-vue/shared@0.3.0` / `@statekit-vue/vue@0.3.0` 已发布；本地 workspace 已准备到 `@statekit-vue/shared@0.4.0`、`@statekit-vue/vue@0.4.0`、`@statekit-vue/react@0.4.0`。  
**最近一轮 sprint**：version-0-4-0-release-prep — 把 React adapter 纳入 `0.4.0` 发布线，完成本地 release 验证，publish 留给人工执行。

### 本轮做了什么

1. **版本线切到 `0.4.0`**：`packages/shared`、`packages/vue`、`packages/react` 三个待发布包版本号已同步到 `0.4.0`。
2. **内部依赖同步**：`@statekit-vue/vue` 和 `@statekit-vue/react` 对 `@statekit-vue/shared` 的依赖已同步到 `0.4.0`。
3. **消费者依赖同步**：`apps/docs` 和 `examples/vite-vue-admin` 已对齐到本地 workspace `0.4.0`。
4. **lockfile 同步**：`package-lock.json` 已更新到 `0.4.0` workspace 引用。
5. **release truth files 同步**：新增 `contracts/version-0-4-0-release-prep.md`，更新 `feature_list.json`、`progress.md`、本 handoff、launch checklist、decision log 和 changelog。
6. **publish 边界明确**：本轮只准备发版并提供命令，不执行 `npm publish`。

### 当前验证状态

```
待运行：npm run verify:release
待运行：npm run review:bundle
待生成：qa/version-0-4-0-release-prep-evaluator-report.md
```

> Windows PATH 提醒：当前环境中直接 `npm` 有时不可解析，实际验证可用 `C:\nvm4w\nodejs\npm.cmd` 执行同等命令。不要把 PATH 问题误判成项目脚本失败。

### 已知风险 / 坑位

1. **npm publish 尚未执行**：本轮只准备 `0.4.0`，下一步需要人工按 shared → vue → react 顺序发布，并用 `npm view` 确认 latest dist-tag。
2. **`@statekit-vue/react` 首次发布**：虽然本地 adapter 已通过上一轮 evaluator，npm 上尚无已确认的 React 版本；发布后必须重点确认 `npm view @statekit-vue/react version`。
3. **Vue docs/example 仍是主可见验证面**：本轮没有新增 React docs route 或 React example app，因此没有新增 Browser MCP 路由证据；后续若新增可见 React 示例，必须补 Playwright/Browser MCP。
4. **GitNexus analyze 会改写 `.claude/skills/*`、`AGENTS.md` / `CLAUDE.md` 的 GitNexus 区块和 `.kagent/*`**：当前工作树包含这些工具生成改动。处理 PR 范围时要区分业务改动和工具索引改动。
5. **依赖 audit 不是本轮范围**：上一轮 `npm install` 报 8 个 vulnerabilities；本轮没有做依赖安全升级，避免把 release prep 扩成工具链升级任务。

---

## 下一轮 agent 应该先做

按优先级：

1. **如果要完成 npm 发布**
   - 确认 `npm run verify:release` 和 `qa/version-0-4-0-release-prep-evaluator-report.md` 均为 PASS。
   - 按顺序执行 `npm publish --workspace @statekit-vue/shared`、`npm publish --workspace @statekit-vue/vue`、`npm publish --workspace @statekit-vue/react`。
   - 发布后运行三个 `npm view <pkg> version`，确认都返回 `0.4.0`。
   - 再把 `feature_list.json` 的 `version-0-4-0-npm-publish` 补齐 `passes: true`、`evaluator` 和 evidence。

2. **如果继续常规功能**
   - 读 `feature_list.json`，找下一个 `passes: false` 条目。
   - 不要重复实现 `react-adapter`，也不要重复 bump 版本线。

3. **后续注意项**
   - 新增 recipe 时同步检查 Vue 与 React 两个 adapter。
   - 如果新增 Playwright project，再回头调整 `snapshotPathTemplate`。
   - 如果要新增 React docs/example 可见页面，按 `docs/quality.md §7` 补控制台日志审查。

开始前按 `AGENTS.md` 顺序读：

1. `AGENTS.md`
2. `docs/README.md`
3. `feature_list.json`
4. `docs/handoff.md`（本文件）
5. `progress.md`
6. `docs/quality.md`
7. 当前 sprint contract（`contracts/<sprint-id>.md`，如有）

---

## 如果你看不懂某个文件

- 先读 `AGENTS.md` 指向的顺序。
- 再读 `docs/runbooks/debug.md`。
- 仍不懂就在 `progress.md` 记一条"未能理解 X"，交给下一轮，不要硬猜。
