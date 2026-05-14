# Handoff · 给下一轮 agent 的交接书

> **规则**：每一轮 agent 结束前必须更新本文件。下一轮 agent 拿到仓库，**第一件事就是读这里**（`AGENTS.md` 入口顺序的第 4 步）。
>
> 本文件只保留**当前**轮次状态。历史轮次留在 `progress.md`。

---

## 当前状态

**更新时间**：2026-05-14
**交接人**：harness 优化轮次（参考 AI-Visualization 框架对齐）
**仓库基线**：`@statekit-vue/shared@0.3.0` / `@statekit-vue/vue@0.3.0`（本地，未发布到 npm）
**最近一轮 sprint**：harness-alignment（本轮）— 引入 `quality.md` / `handoff.md` / `verify.ps1` / `contracts/` / `qa/` / `feature_list.json` v0.2 schema。

### 本轮做了什么

1. **新增 `docs/quality.md`**：把 DoD 六条硬指标、§7 Evaluator 控制台日志审查规程、StateKit 默认噪音分级表收口。
2. **新增 `docs/handoff.md`**（本文件）：替代以前散落在 `statekit-ai-handoff-brief.md` 与 `progress.md` 之间的"下一轮 agent 应该做什么"，做成单一入口。
3. **新增 `verify.ps1`**：PowerShell 单一门禁脚本，串行跑 verify:fast / verify:ui / pack:check / smoke:install，结尾打印 `VERIFY OK`。
4. **新增 `contracts/`**：sprint contract 模板，新一轮任务前可选生成 `contracts/<sprint-id>.md`。
5. **新增 `qa/`**：Evaluator 报告输出目录骨架 + README。
6. **新增 `docs/runbooks/debug.md`**：把零散排障知识收成入口。
7. **重构 `feature_list.json`**：补 `meta` 段、`evaluator` 字段、`evidence` 字段；历史条目用 `unverified-legacy: true` 标记可追溯。
8. **重写 `AGENTS.md`**：改成"地图"风格，把入口压到 2 分钟阅读量，细节回到 `docs/`。

### 当前验证状态

```
npm run verify:fast        ⏸ 待跑（harness 文件改动属 Light Review，不阻塞功能）
npm run verify:ui          ⏸ 待跑
.\verify.ps1               ⏸ 待跑
```

> 本轮只动 harness/文档层，未触碰 `packages/`、`apps/docs/src/`、`examples/`，按 `quality.md §1` Light Review 级别处理。

### 已知风险 / 坑位

1. **`feature_list.json` 历史条目证据回填**：本轮回填到 `progress.md` + `.agent/` 截图能查到的范围；未在历史中归档独立 evaluator 报告的条目，标 `evaluator: "self-verified-by-builder@<回填日期>"` + `unverified-legacy: true`。下一轮 evaluator 可补跑确认。
2. **`qa/` 目录是空骨架**：还没有真实 evaluator 报告。下一轮第一份报告建议从 `version-0-3-0-release` 入手。
3. **`verify.ps1` 未在 CI 跑过**：当前只在本地手跑过冷启动；任何步骤失败请回到 `runbooks/debug.md`。
4. **AGENTS.md 重写**：先读顺序变了。如果 agent 还在按旧顺序读，让它停下来重新读 `AGENTS.md`。

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

3. **`docs-handwritten-copy-reduction`** 仍标 `passes: true`，但 `TODO.md` 的 P1 列表里还留着"减少 docs 站手写分类文案"。下一轮可以接着推进，不强制。

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
