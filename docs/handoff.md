# Handoff · 给下一轮 agent 的交接书

> **规则**：每一轮 agent 结束前必须更新本文件。下一轮 agent 拿到仓库，**第一件事就是读这里**（`AGENTS.md` 入口顺序的第 4 步）。
>
> 本文件只保留**当前**轮次状态。历史轮次留在 `progress.md`。

---

## 当前状态

**更新时间**：2026-05-17
**交接人**：visual-regression-screenshots 轮次
**仓库基线**：`@statekit-vue/shared@0.3.0` / `@statekit-vue/vue@0.3.0`（用户本轮说明 0.3.0 已发版；`feature_list.json` 的 release evidence 本轮未追溯补齐）
**最近一轮 sprint**：visual-regression-screenshots — 为 error / permission / success 插图补 CI 可重复截图回归测试。

### 本轮做了什么

1. **新增 `apps/docs/tests/visual-regression-screenshots.spec.ts`**：覆盖 error cross 居中、permission lock 居中、success 无 shadow line。
2. **新增三张 Playwright 基线图**：位于 `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/`。
3. **稳定 snapshot 路径**：`playwright.config.ts` 增加 `snapshotPathTemplate`，避免 Windows / CI 生成不同平台后缀文件名。
4. **放行截图基线入库**：`.gitignore` 保持默认忽略普通 PNG，但允许 `apps/docs/tests/__screenshots__/**/*.png`。
5. **独立 Evaluator 放行**：`qa/visual-regression-screenshots-evaluator-report.md` 结论 PASS，并包含目标路由 console/pageerror 抽查。
6. **功能清单闭环**：`feature_list.json` 的 `visual-regression-screenshots` 已补 `passes: true`、`evaluator` 和 `evidence`。

### 当前验证状态

```
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts --update-snapshots ✅ 3 passed
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts                    ✅ 3 passed
npm run verify:fast                                                                                              ✅ 2026-05-17 通过
npm run verify:ui                                                                                                ✅ 2026-05-17 通过（39 passed）
Evaluator target spec                                                                                            ✅ 3 passed
Evaluator verify:ui                                                                                              ✅ 39 passed
```

> 本轮涉及 UI 测试与截图基线，按 Standard Review 级别处理；独立 Evaluator 报告已落 `qa/visual-regression-screenshots-evaluator-report.md`。

### 已知风险 / 坑位

1. **release 条目仍未证据闭环**：用户本轮说明 `v0.3.0` 已经发版，但 `feature_list.json` 的 `version-0-3-0-release` 仍是 `passes: false`。下一轮如果处理它，应先核对 npm 版本和既有发布证据，只补 evaluator/evidence，不要重复 publish。
2. **snapshotPathTemplate 当前未包含 projectName**：现有 Playwright 只有 Chromium desktop project，没问题；未来如果新增多浏览器或多 viewport project，需要重新规划 snapshot 路径，避免不同 project 共用同名基线。
3. **Browser MCP 分工**：Builder 本轮没有自己宣称 Browser MCP 通过；Evaluator 使用 Playwright console/pageerror 抽查三条目标路由，结果 error/warning/pageerror 均为 0。

---

## 下一轮 agent 应该先做

按优先级：

1. **`version-0-3-0-release` evidence reconciliation**（`feature_list.json` 中仍是 `passes: false`）
   - 用户本轮说明 0.3.0 已经发版；不要默认再次 publish。
   - 先核对 `npm view @statekit-vue/shared version` 和 `npm view @statekit-vue/vue version` 是否均为 `0.3.0`。
   - 若确已发布，补跑必要验证 / 控制台审查，写 `qa/version-0-3-0-release-evaluator-report.md`，再把 `feature_list.json` 证据闭环。
   - 若 npm 版本不是 0.3.0，再回到 release checklist，不要靠口头状态改 true。

2. **后续可选项**
   - 当前 `visual-regression-screenshots` 已完成，不要重复实现。
   - 如果新增 Playwright project，再回头调整 `snapshotPathTemplate`。

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
