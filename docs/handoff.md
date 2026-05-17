# Handoff · 给下一轮 agent 的交接书

> **规则**：每一轮 agent 结束前必须更新本文件。下一轮 agent 拿到仓库，**第一件事就是读这里**（`AGENTS.md` 入口顺序的第 4 步）。
>
> 本文件只保留**当前**轮次状态。历史轮次留在 `progress.md`。

---

## 当前状态

**更新时间**：2026-05-17
**交接人**：docs 清理轮次
**仓库基线**：`@statekit-vue/shared@0.3.0` / `@statekit-vue/vue@0.3.0`（本地，未发布到 npm）
**最近一轮 sprint**：docs-cleanup（本轮）— 清理过时交接文档，统一到 `feature_list.json` / `docs/handoff.md` / `progress.md`。

### 本轮做了什么

1. **删除 `docs/statekit-ai-handoff-brief.md`**：它已被 `docs/handoff.md` + `feature_list.json` + `progress.md` 取代。
2. **保留 `docs/交接/TODO.md` 的删除状态**：TODO 的功能清单职责已迁移到 `feature_list.json`；后续不要再把旧 TODO 当作范围来源。
3. **更新旧引用**：同步 `docs/README.md`、`docs/statekit-agent-harness.md`、review 模板、`AGENTS.md`、`CONTRIBUTING.md` 和 release checklist。
4. **修正过期规格口径**：`docs/statekit-block-spec.md` 从 19 个旧 Block 更新为 21 个 preset recipe，并补齐两个 onboarding recipe。
5. **保留 `docs/statekit-launch-checklist.md`**：它仍是 0.3.0 release 人工检查清单；若本轮已有 contract，以 `contracts/<sprint-id>.md` 为准。

### 当前验证状态

```
npm run verify:fast        ✅ 2026-05-17 通过
npm run verify:ui          ⏸ 未跑（本轮无 UI / 路由 / 响应式改动）
.\verify.ps1               ⏸ 未跑（本轮非 release）
```

> 本轮只动文档层，未触碰 `packages/`、`apps/docs/src/`、`examples/`，按 `quality.md §1` Light Review 级别处理。

### 已知风险 / 坑位

1. **`feature_list.json` 历史条目证据回填**：本轮回填到 `progress.md` + `.agent/` 截图能查到的范围；未在历史中归档独立 evaluator 报告的条目，标 `evaluator: "self-verified-by-builder@<回填日期>"` + `unverified-legacy: true`。下一轮 evaluator 可补跑确认。
2. **`qa/` 目录仍是空骨架**：还没有真实 evaluator 报告。下一轮第一份报告建议从 `version-0-3-0-release` 入手。
3. **`verify.ps1` 未在 CI 跑过**：当前只在本地手跑过冷启动；任何步骤失败请回到 `runbooks/debug.md`。
4. **`docs/statekit-launch-checklist.md` 仍是 release 辅助清单**：如果创建 `contracts/version-0-3-0-release.md`，应把 checklist 中未完成的人工检查项映射进 contract。

---

## 下一轮 agent 应该先做

按优先级：

1. **`version-0-3-0-release`**（`feature_list.json` 中第一个 `passes: false`）
   - 跑 `npm run verify:release`（或 `.\verify.ps1`）。
   - `pack:check` + `smoke:install` 必须通过。
   - 人工浏览 `/examples/onboarding-activation` 和 `examples/vite-vue-admin` 确认 onboarding vs empty vs success 语义边界。
   - 通过后 `npm publish @statekit-vue/shared` + `npm publish @statekit-vue/vue`。
   - 写 `qa/version-0-3-0-release-evaluator-report.md`。

2. **`visual-regression-screenshots`**（`feature_list.json` 第二个 `passes: false`）
   - 在 `apps/docs/tests/` 新增截图比对 spec，覆盖 error cross 居中、permission lock 居中、success 无 shadow line。
   - 重点是 CI 环境下截图比对可重复。

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
