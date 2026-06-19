# React Adapter Evaluator Report

日期：2026-06-20
角色：独立 Evaluator / Reviewer
范围：复审当前工作树中的 React adapter 修复；不修改实现代码

## 结论

复审结论：**PASS / 建议放行本地 React adapter 交付**。

第一次审查中指出的两个 Major 均已关闭：

1. **M1 已关闭**：`OnboardingState` 现在保留默认 media，但不再注入默认 `DefaultOnboardingActions`。当调用方未显式传入 `actions` 时，默认 CTA 回到 `StateBlockShell` 统一 action 渲染路径，因此 `onClick`、`loading`、`loadingLabel`、`disabled`、`href`、`aria-busy`、`aria-disabled` 等语义恢复。
2. **M2 已关闭**：`feature_list.json` 已新增 `react-adapter` 条目并带 `passes/evaluator/evidence`；`progress.md` 顶部已有 2026-06-20 React adapter 记录；`docs/handoff.md` 已更新到当前轮次；`docs/statekit-launch-checklist.md` 已修正 smoke 与 npm 发布事实。

本轮复审没有发现新的 Blocking 或 Major。

注意：本报告只放行当前本地实现、验证链和 truth files 闭环；`@statekit-vue/react@0.3.0` 仍未发布到 npm，发布应另开 release 任务。

## 检查范围

复审重点：

- `packages/react/src/blocks/category-components.tsx`
- `packages/react/src/blocks/CategoryEntries.test.tsx`
- `packages/react/src/base/StateBlockShell.tsx`
- `packages/react/src/base/StatePresetBlock.tsx`
- `packages/react/src/blocks/preset-components.tsx`
- `packages/react/src/index.ts`
- `packages/react/package.json`
- `packages/react/tsconfig.build.json`
- `scripts/check-boundaries.mjs`
- `scripts/smoke-install.mjs`
- `package.json`
- `vitest.config.ts`
- `tsconfig.base.json`
- `feature_list.json`
- `progress.md`
- `docs/handoff.md`
- `docs/statekit-launch-checklist.md`

结构审查结果：

- CodeGraph 当前可读，无 staleness banner；索引包含 TSX 文件。
- `OnboardingState` 当前实现位于 `packages/react/src/blocks/category-components.tsx:172-190`：只传入默认 `DefaultOnboardingMedia`，`actions={actions}` 保持调用方显式传入时才替换。
- `StateBlockShell` 仍负责 action 归一化：`getRenderedActions` 处理 loading/disabled/href，`handleActionClick` 阻止 unavailable action 并透传 native mouse event。
- `CategoryEntries.test.tsx:182-205` 新增回归测试，覆盖 `OnboardingState` 默认 actions 的 `loadingLabel`、`aria-busy`、`aria-disabled`、`disabled` 和不可点击语义。
- `feature_list.json` 已有 `react-adapter` P0 条目，含 `steps`、`verified_by`、`passes: true`、`evaluator` 和 `evidence.qa_report`。
- `progress.md` 顶部新增 `2026-06-20 React adapter`，记录实现范围、两个 Major 的修复、验证命令和命令层 warning。
- `docs/handoff.md` 已更新当前状态、验证状态、风险与下一轮接手顺序。
- `docs/statekit-launch-checklist.md` 已把 `smoke:install` 标为 2026-06-20 覆盖 Vue + React 外部消费者，同时明确 `@statekit-vue/react@0.3.0` 尚未发布。

影响面：

- GitNexus `detect_changes(scope=unstaged)` 返回 `risk_level: high`，当前未提交变更涉及 34 个文件、109 个 changed symbols、10 条 affected processes。高风险来自新增 framework adapter、边界脚本、smoke 安装链和多份公开文档/truth files 同时变化；经复审，当前验证链已覆盖主要风险面。

## 验证命令

说明：为避免当前 Windows shell 中 `npm` PATH 偶发解析问题，本轮复审使用 `C:\nvm4w\nodejs\npm.cmd` 执行等价 npm 命令。

| 命令 | 结果 | 摘要 |
| --- | --- | --- |
| `Get-Content -LiteralPath feature_list.json -Encoding UTF8 \| ConvertFrom-Json \| Out-Null` | PASS | `feature_list.json` 可被 PowerShell JSON parser 解析。 |
| `& 'C:\nvm4w\nodejs\npm.cmd' run verify:fast` | PASS | `lint:boundaries`、typecheck、unit tests、build 全通过；8 test files / 50 tests passed。 |
| `& 'C:\nvm4w\nodejs\npm.cmd' run pack:check` | PASS | shared/vue/react dry-run tarball 均通过；React tarball `entryCount: 18`，无 test-utils / test files。 |
| `& 'C:\nvm4w\nodejs\npm.cmd' run smoke:install` | PASS | 外部 Vue consumer 与 React consumer 均完成 install、typecheck、build；输出 `external Vue and React consumer builds passed`。 |
| `& 'C:\nvm4w\nodejs\npm.cmd' run lint:boundaries` | PASS | `[StateKit] Boundary check passed. Checked 72 files, 242 imports, and 5 manifests.` |
| CodeGraph context: React `OnboardingState` fix | PASS | `OnboardingState` 当前只传 `actions={actions}`，默认 actions 走 `StateBlockShell`。 |
| GitNexus `detect_changes(scope=unstaged)` | REVIEWED | 风险为 high，但影响面与本轮新增 adapter / scripts / truth files 一致。 |

`verify:fast` 关键输出摘要：

```text
[StateKit] Boundary check passed. Checked 72 files, 242 imports, and 5 manifests.
Test Files  8 passed (8)
Tests       50 passed (50)
@statekit-vue/shared build PASS
@statekit-vue/vue build PASS
@statekit-vue/react build PASS
@statekit/docs build PASS
@statekit/example-vite-vue-admin build PASS
```

`pack:check` React tarball 摘要：

```text
@statekit-vue/react@0.3.0
filename: statekit-vue-react-0.3.0.tgz
entryCount: 18
bundled: []
files: README.md, package.json, dist/*.js, dist/*.css, dist/*.d.ts, dist/*.d.ts.map
```

## 控制台日志审查

本轮没有运行 Browser MCP 路由，也没有打开 docs/example 页面。

不适用原因：

- 本轮复审重点是 React adapter package、unit behavior、build/typecheck、tarball 内容、边界检查、外部 consumer smoke install，以及 truth files 闭环。
- 当前变更没有新增 docs route、React example app 或需要浏览器 Golden Path 的可见页面。
- `docs/handoff.md` 已明确：若后续新增 React docs route 或可见 React example，需要补 Browser MCP / Playwright 路由 console 审查。

命令层 warning / error：

- `verify:fast` 末尾仍输出 Vite/Vitest 工具链 warning：`The CJS build of Vite's Node API is deprecated.` 这是现有工具链 deprecation warning，不影响本轮验证结论。
- `progress.md` 记录 `npm install` 曾报 8 个 audit vulnerabilities；本轮没有做依赖安全升级，避免把 React adapter 任务扩大成依赖治理任务。
- 本轮复审命令本身无阻塞 error；`lint:boundaries`、typecheck、unit、build、pack、smoke 均通过。

Browser console / pageerror：

- 不适用，未执行 Browser MCP 或 Playwright 路由访问，因此没有页面 console error/warning/pageerror 记录。

## Findings

### Blocking

无。

### Major

无。

已关闭的 Major：

- **M1 已关闭**：`OnboardingState` 默认 actions 现在回到 `StateBlockShell` 统一 action contract。复审依据：
  - `packages/react/src/blocks/category-components.tsx:172-190`
  - `packages/react/src/blocks/CategoryEntries.test.tsx:182-205`
  - `npm run verify:fast` 中 React `CategoryEntries.test.tsx` 10 tests passed
- **M2 已关闭**：truth files 已闭环。复审依据：
  - `feature_list.json` 新增 `react-adapter` 条目，且 `passes/evaluator/evidence` 齐全
  - `progress.md` 顶部新增 `2026-06-20 React adapter`
  - `docs/handoff.md` 更新到 React adapter 当前状态
  - `docs/statekit-launch-checklist.md` 修正 `smoke:install` 与 React npm 未发布事实
  - `feature_list.json` ConvertFrom-Json PASS

### Minor

**m1. Vite CJS Node API deprecation warning 仍存在**

`verify:fast` 末尾仍输出：

```text
The CJS build of Vite's Node API is deprecated.
```

这不是 React adapter 阻塞项，但建议后续工具链维护时统一处理，避免 CI warning 噪音。

**m2. `@statekit-vue/react@0.3.0` 尚未发布**

本轮只放行本地 adapter 与验证链；`docs/handoff.md` 和 `docs/statekit-launch-checklist.md` 已明确 React 包尚未 npm publish。后续如果要发布，需要单独走 release 流程和 npm dist-tag 核对。

## 放行建议

建议 **PASS / 放行本地 React adapter 交付**。

放行依据：

- `packages/react` 复用 `@statekit-vue/shared` metadata，不依赖 Vue runtime。
- React 包导出 7 个 category-first 入口和 21 个 preset compatibility exports。
- `StateBlockShell` / `StatePresetBlock` 的 action、loading、disabled、href、layout fallback、media/actions props 语义已被单测覆盖。
- `OnboardingState` 默认 actions 回归到 shell action contract，原 M1 已关闭。
- `scripts/check-boundaries.mjs` 已纳入 React adapter，并禁止 React 依赖 Vue/docs/example。
- `scripts/smoke-install.mjs` 同时验证 Vue 和 React 外部消费者。
- `pack:check` 中 React tarball 不包含 test-utils 或 test files。
- `feature_list.json`、`progress.md`、`docs/handoff.md`、`docs/statekit-launch-checklist.md` 已完成当前轮次 truth-file 闭环，原 M2 已关闭。
- 独立复审命令通过：`feature_list.json` JSON parse、`verify:fast`、`pack:check`、`smoke:install`、`lint:boundaries`。

后续建议：

1. 若要发布 `@statekit-vue/react@0.3.0`，单独开 release 任务，不要把本轮 PASS 等同于 npm 已发布。
2. 若新增 React docs route 或 React example app，需要补 Browser MCP / Playwright 路由控制台审查。
3. 后续新增 recipe 时，同步检查 Vue 与 React 两个 adapter 的 preset wrapper、测试和包产物。
