# Handoff · 给下一轮 agent 的交接书

> **规则**：每一轮 agent 结束前必须更新本文件。下一轮 agent 拿到仓库，**第一件事就是读这里**（`AGENTS.md` 入口顺序的第 4 步）。
>
> 本文件只保留**当前**轮次状态。历史轮次留在 `progress.md`。

---

## 当前状态

**更新时间**：2026-05-17
**交接人**：release evidence + visual-regression-screenshots 收口轮次
**仓库基线**：`@statekit-vue/shared@0.3.0` / `@statekit-vue/vue@0.3.0`（npm 已发布，`feature_list.json` 的 release evidence 已用 `npm view ... versions` 闭环）
**最近一轮 sprint**：visual-regression-screenshots — 为 error / permission / success 插图补 CI 可重复截图回归测试；随后按用户授权补齐 `version-0-3-0-release` evidence。

### 本轮做了什么

1. **0.3.0 release evidence 闭环**：按用户授权，直接把 `feature_list.json` 的 `version-0-3-0-release` 改为 `passes: true`。
2. **npm 发布状态已核对**：宿主环境运行 `npm view @statekit-vue/shared versions` 和 `npm view @statekit-vue/vue versions`，两者返回列表末尾均为 `0.3.0`；这两条命令输出已写入 release evidence。
3. **新增 `apps/docs/tests/visual-regression-screenshots.spec.ts`**：覆盖 error cross 居中、permission lock 居中、success 无 shadow line。
4. **新增三张 Playwright 基线图**：位于 `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/`。
5. **修复 CI success snapshot 漂移**：success 基线已从完整图标截图收窄为 masked shadow-line probe，避免 Linux / Windows 对渐变和 rotated check 的渲染差异造成误报。
6. **稳定 snapshot 路径**：`playwright.config.ts` 增加 `snapshotPathTemplate`，避免 Windows / CI 生成不同平台后缀文件名。
7. **放行截图基线入库**：`.gitignore` 保持默认忽略普通 PNG，但允许 `apps/docs/tests/__screenshots__/**/*.png`。
8. **独立 Evaluator 放行**：`qa/visual-regression-screenshots-evaluator-report.md` 结论 PASS，并包含目标路由 console/pageerror 抽查。
9. **功能清单闭环**：`feature_list.json` 的 `version-0-3-0-release` 与 `visual-regression-screenshots` 均已补 `passes: true`、`evaluator` 和 `evidence`。

### 当前验证状态

```
npm view @statekit-vue/shared versions                                                                            ✅ latest 0.3.0
npm view @statekit-vue/vue versions                                                                               ✅ latest 0.3.0
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts --update-snapshots ✅ 3 passed
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts                    ✅ 3 passed
npm run verify:fast                                                                                              ✅ 2026-05-17 通过
npm run verify:ui                                                                                                ✅ 2026-05-17 通过（39 passed）
CI follow-up: success shadow-line probe update + target spec                                                      ✅ 3 passed
CI follow-up: npm run verify:ui                                                                                   ✅ 39 passed
Evaluator target spec                                                                                            ✅ 3 passed
Evaluator verify:ui                                                                                              ✅ 39 passed
```

> 本轮涉及 UI 测试与截图基线，按 Standard Review 级别处理；独立 Evaluator 报告已落 `qa/visual-regression-screenshots-evaluator-report.md`。

### 已知风险 / 坑位

1. **release 已闭环，不要重复 publish**：`feature_list.json` 的 `version-0-3-0-release` 已按用户授权用 npm view evidence 改为 `passes: true`。下一轮不要再执行 `npm publish @statekit-vue/shared` 或 `npm publish @statekit-vue/vue`。
2. **snapshotPathTemplate 当前未包含 projectName**：现有 Playwright 只有 Chromium desktop project，没问题；未来如果新增多浏览器或多 viewport project，需要重新规划 snapshot 路径，避免不同 project 共用同名基线。
3. **success 截图不是完整外观快照**：它是专门检测 shadow line 是否回归的 masked probe；完整 success 外观仍由组件样式和结构断言兜底，不要把这张图当成视觉设计基线。
4. **Browser MCP 分工**：Builder 本轮没有自己宣称 Browser MCP 通过；Evaluator 使用 Playwright console/pageerror 抽查三条目标路由，结果 error/warning/pageerror 均为 0。

---

## 下一轮 agent 应该先做

按优先级：

1. **找下一个 `passes: false` 条目**
   - 当前 `version-0-3-0-release` 和 `visual-regression-screenshots` 都已完成。
   - 下一轮先读 `feature_list.json`，重新按顺序找第一个 `passes: false`；不要沿用旧 handoff 里的 release / visual-regression 任务。

2. **后续注意项**
   - 不要重复 publish 0.3.0。
   - 不要重复实现 `visual-regression-screenshots`。
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
