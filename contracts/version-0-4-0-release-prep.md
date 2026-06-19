# Sprint Contract · version-0-4-0-release-prep

## 1. 范围（必填）

- **目标**：把 StateKit 本地 workspace 准备到 `v0.4.0` 可发布状态，并给出人工 npm publish 命令。
- **对应 `feature_list.json` 条目**：新增 `version-0-4-0-release-prep`；同时新增后续待人工执行的 `version-0-4-0-npm-publish`。
- **不在范围内**：本轮不执行 `npm publish`，不处理既有 npm audit vulnerabilities，不新增 React docs route 或 React example app。

## 2. 当前事实（必填）

- 相关源码：`packages/shared`、`packages/vue`、`packages/react`。
- 相关测试：`npm run verify:release` 覆盖 boundaries、typecheck、build、unit、Playwright UI、pack:check、smoke:install。
- 相关 docs：`docs/statekit-launch-checklist.md`、`docs/handoff.md`、`progress.md`、`docs/交接/CHANGELOG.md`。
- 当前已知行为 / 约束：`@statekit-vue/shared@0.3.0` 与 `@statekit-vue/vue@0.3.0` 已发布；`@statekit-vue/react` 是上一轮新增 adapter，本轮随 `0.4.0` 一起准备发布。

## 3. 修改面（必填）

允许修改：

- `packages/*/package.json`
- `apps/docs/package.json`
- `examples/vite-vue-admin/package.json`
- `package-lock.json`
- `docs/...`
- `feature_list.json`
- `progress.md`
- `qa/version-0-4-0-release-prep-evaluator-report.md`

不应修改：

- 已 `passes: true` 且与本轮无关的 `feature_list.json` 条目
- `packages/*/src` 运行时代码
- `apps/docs/src` 与 `examples/vite-vue-admin/src` 可见 UI 实现
- `node_modules`、`dist`、`test-results`

## 4. 实现计划（必填）

1. 将 `@statekit-vue/shared`、`@statekit-vue/vue`、`@statekit-vue/react` 版本号切到 `0.4.0`。
2. 将 Vue / React adapter 以及 docs / example 的内部 workspace 依赖同步到 `0.4.0`。
3. 更新 release checklist、handoff、progress、changelog 和 feature list，明确 publish 仍待人工执行。
4. 运行 `npm run verify:release` 与 `npm run review:bundle`。
5. 交给独立 evaluator 审查 release prep，并补 QA 报告。

## 5. 验收标准（必填）

- [ ] `feature_list.json` 中 `version-0-4-0-release-prep` 为 `passes: true` + `evaluator` + `evidence`
- [ ] `npm run verify:release` 全绿
- [ ] `npm run review:bundle` 已生成 `.agent/review-bundle.md`
- [ ] `progress.md` 新增本轮日志
- [ ] `docs/handoff.md` 已写下一轮 publish 状态
- [ ] `pack:check` + `smoke:install` + `qa/version-0-4-0-release-prep-evaluator-report.md` 全部就位

## 6. 失败阈值（必填）

- `verify:release` 任一步红
- 三个待发布包的 manifest 版本不是 `0.4.0`
- Vue / React adapter 对 `@statekit-vue/shared` 的依赖没有同步到 `0.4.0`
- `pack:check` tarball 包含测试产物或缺少 dist / README
- `smoke:install` 外部 Vue 或 React consumer 任一失败
- Evaluator 报告缺放行建议

## 7. 风险与回退（建议填）

- 可能影响：npm publish 顺序；必须先发 shared，再发 Vue / React adapter。
- 需要重点 review：`package-lock.json` 版本引用、发布 checklist、publish 命令。
- 失败时回滚策略：只回滚本轮版本线和 release 文档，不回滚上一轮 React adapter 业务改动。

## 8. 完成记录（交付前回填）

- 修改文件：待回填
- 实际运行命令：待回填
- Browser MCP QA：本轮未改可见 UI；以 Playwright `test:ui` 和 evaluator 审查为 release prep 证据
- Evaluator 报告：`qa/version-0-4-0-release-prep-evaluator-report.md`
- 未覆盖风险：本轮不执行 npm publish，发布后 dist-tag 需人工用 `npm view` 确认
