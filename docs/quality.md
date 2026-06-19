# Quality · Definition of Done

> "完成"不是感觉，是证据。

这份文档定义 StateKit 仓库每一轮交付的硬指标。如果交付没满足这里的全部条件，就**不允许**把 `feature_list.json` 对应项的 `passes` 字段改成 `true`，也不允许在 `progress.md` 中宣布完成。

---

## 1. DoD 硬指标（六条同时满足）

| # | 要求 | 如何证明 |
|---|------|----------|
| 1 | `feature_list.json` 对应项 `passes: true` + `evaluator` 字段 + `evidence` 字段 | git diff `feature_list.json`，引用 `qa/<sprint-id>-evaluator-report.md` |
| 2 | 独立 Evaluator 放行建议为 PASS（Standard / Release 级别必备） | QA 报告末段"放行建议" |
| 3 | Evaluator `## 控制台日志审查` 段落齐全（涉及 UI 时） | 见 §7 |
| 4 | `npm run verify:fast` 全绿（涉及 UI 时再跑 `verify:ui`，发版时再跑 `verify:release`） | 终端输出贴回 `progress.md` |
| 5 | `progress.md` 新增本轮日志（做了什么 / 为什么 / 怎么验证 / Browser MCP 记录） | git diff |
| 6 | `docs/handoff.md` 已更新到下一轮 agent 可接手状态 | git diff |

> Light Review 级别（仅文档/harness）允许跳过 §7 控制台日志审查，但仍需满足第 1、4、5、6 条。

---

## 2. 验证优先级（从高到低）

1. **应用能跑起来**（`npm run dev:docs` / `npm run dev:example` 不白屏）
2. **真实用户路径走通**（Playwright + Browser MCP）
3. **控制台零阻塞性 error / warning**（见 §7）
4. **边界场景**（移动端断点、中英文 locale 切换、空 recipe、缺失 evidence 兜底）
5. **代码结构和风格**（lint:boundaries / typecheck / test:unit）

> 顺序不能倒置。一个只过 typecheck 但 onboarding-activation 走不通的 PR 是 3.25。

---

## 3. 失败阈值（任一触发即失败）

- 7 个 category-first 入口任意一个核心 recipe 渲染失败 → 失败
- docs 站 `/`、`/recipes`、`/recipes/<slug>`、`/examples/onboarding-activation` 任意一条主路径 404 / 白屏 → 失败
- `examples/vite-vue-admin` onboarding-to-completion 叙事链断裂 → 失败
- 中文 locale `/zh-CN` 路由家族任意一项无法切换或导航丢页 → 失败
- 移动端（≤ 760px）出现横向溢出 → 失败
- `npm run verify:fast` 任一步红 → 失败
- `feature_list.json` 的 `passes` 被改成 `true` 但 `evidence` 缺失或不可复现 → 失败
- Evaluator 报告缺 `## 控制台日志审查` 段落，或出现阻塞性 error / warning 但被判"不影响" → 失败（见 §7）
- 弱化 `lint:boundaries` 规则、删减 Playwright 断言、用 `any` / `@ts-ignore` 偷懒 → 失败

---

## 4. Evidence 格式

`feature_list.json` 的 `evidence` 字段必须指向**可复现产物**，且必须配 `evaluator` 字段标注独立验收人或来源。

```jsonc
{
  "id": "onboarding-recipe-family",
  "passes": true,
  "evaluator": "general-purpose-subagent@2026-05-04",
  "evidence": {
    "qa_report": "qa/sprint-onboarding-recipe-family-evaluator-report.md",
    "verify_log": "progress.md#2026-05-09-onboarding-recipe-插槽示例与-media-stat-边界修复",
    "playwright": "apps/docs/tests/recipes-navigation.spec.ts",
    "screenshot_desktop": ".agent/docs-onboarding-recipe-desktop-fixed.png",
    "screenshot_mobile": ".agent/docs-onboarding-recipe-mobile.png"
  }
}
```

> `evaluator` 不是可选字段。`unverified-legacy: true` 是兼容历史条目的过渡标记，新轮次必须给出真实 evaluator。

---

## 5. 假完成的典型样子（agent 常踩）

| 假完成 | 真完成 |
|--------|--------|
| "我把 onboarding-members recipe 加上了" | shared 元数据 + Vue 渲染 + docs 详情页 + Playwright 都对齐，且 `npm run pack:check` 包内容包含 |
| "中文站点能用了" | `apps/docs/tests/chinese-locale.spec.ts` 全绿 + Browser MCP 记录的语言切换路径 |
| "verify 过了" | 贴出 `verify:fast` / `verify:ui` 终端输出到 `progress.md`，并标注实际命令 |
| "Console 没报错" | 列出**全部 warning + error**，逐条按 §7 判定阻塞 / 非阻塞 / 可忽略 |
| "改完了" | `docs/handoff.md` 已写"下一轮 agent 应该先做" |

---

## 6. 对"改验收标准让自己过"的零容忍

- `feature_list.json` 的 `steps` / `verified_by` 字段**只允许补充更严格的验证**，禁止删减或弱化。
- 若 steps 真的写错了（例如和 `docs/statekit-block-spec.md` 不一致），修改必须：
  1. 在 `docs/decision-log.md` 新增一条 `D-NNN` 记录；
  2. `progress.md` 显式记录"调整了验收标准"；
  3. 走 Standard Review。

---

## 7. Evaluator 控制台日志审查规程（硬规则）

### 7.1 规则

涉及 UI 的轮次，Evaluator 子代理在出 QA 报告前**必须**：

1. 用 Chrome DevTools MCP（`mcp__chrome-devtools__list_console_messages`）或 Playwright 的 `page.on('console')` / `page.on('pageerror')`，把走 Golden Path 期间浏览器 Console 产生的**全部日志**收集下来。
2. 按 `error` / `warning` / `log` 分类写进 `qa/<sprint-id>-evaluator-report.md` 的 `## 控制台日志审查` 段落。
3. **逐条**判定每条 warning / error，给出三选一结论：
   - **阻塞**：影响任意 Golden Path 或 `feature_list.json` steps → **直接 FAIL**，不得放行。
   - **非阻塞但需跟进**：不影响当前轮次，但可能在未来踩坑 → 写进 `docs/handoff.md` 已知风险 + `decision-log.md`。
   - **可忽略**：第三方库无关噪音 / 已知 Chromium 警告 / dev-only 提示 → 给来源证据（库名、版本、issue 链接）。
4. 至少**抽查一次**：移动端 760px、中文 locale `/zh-CN/`、recipe 详情页跨 slug 切换、example app 视口 resize（onboarding-to-completion 叙事中容易触发）。

### 7.2 报告模板（Evaluator 必须照抄）

```markdown
## 控制台日志审查

### 覆盖场景

- 主路径：/ → /recipes → /recipes/onboarding-workspace-state
- 示例页：/examples/onboarding-activation 完整 4 步流程
- 中文 locale：/zh-CN/ → /zh-CN/recipes 切换
- 移动端：viewport=390x844，无横向溢出
- example app：onboarding → empty → loading → error → permission → upgrade → success 串联

### 日志统计

- error：<数量>
- warning：<数量>
- log / info：<数量>（可只给总数）

### 逐条判定（只列 error 和 warning）

| # | level | 内容（首 120 字符） | 来源 | 判定 | 理由 |
|---|-------|---------------------|------|------|------|
| 1 | warn  | ...                 | vue@3.4 hydration | 阻塞 | ... |
| 2 | error | favicon.ico 404     | apps/docs/public 缺资源 | 可忽略 | 非业务路径 |

### 结论

- 全部 error / 阻塞 warning 是否已修：Y / N
- 非阻塞但需跟进项是否已写进 handoff：Y / N
- 本轮 Golden Path 是否受 console 影响：Y / N

> 任一结论为 N → 整份 QA 报告判 FAIL，禁止把 `feature_list.json` 对应项改成 `passes: true`。
```

### 7.3 StateKit 默认噪音分级（可复用，更新走 decision-log）

| 来源 | 默认分级 | 备注 |
|------|----------|------|
| `vite` HMR / websocket / `[vite] connecting…` | 可忽略 | dev-only |
| `favicon.ico` 404（docs / example） | 可忽略 | 非业务路径，长期可补 |
| `DevTools failed to load source map` | 可忽略 | Chrome 自身 |
| `[Vue warn] Hydration ...` | **阻塞** | 不允许在 docs / example 出现 |
| `[Vue warn] Failed to resolve component` | **阻塞** | 一般是 recipe slot 出错 |
| `Extraneous non-props attributes` | 非阻塞但需跟进 | 通常是 `StateBlockShell` 透传规则不严 |
| a11y 警告（缺 alt / 缺 aria-label） | 非阻塞但需跟进 | 写进 handoff 长期修 |
| `The resource ... was preloaded using link preload but not used` | 非阻塞但需跟进 | docs 站 vite preload 误判 |
| 任何 `Uncaught` / `Unhandled` | **阻塞** | 除非白名单 |
| 业务代码（`packages/`、`apps/docs/src/`、`examples/`）`console.warn` / `console.error` | **阻塞** | 要么是真 bug，要么应该删 |
| `vue-router` "No match for ..." | **阻塞** | 通常是路由变更未同步导航 |

> 白名单更新必须走 `docs/decision-log.md`，agent 不能自己加。

### 7.4 Builder 侧的义务

- 交付前自己先跑一遍 §7.2 模板的采集，预判 Evaluator 会在哪里卡。
- 不要在 `packages/`、`apps/docs/src/`、`examples/` 留 `console.log`；只允许 `console.warn` / `console.error` 且必须有理由。
- 改动触发新 warning 时，**同 PR 内**要么修掉，要么在 `decision-log.md` 登记理由。

---

## 8. 与 Review Loop 的关系

`docs/agent-review-loop.md` 定义 Light / Standard / Release 三档审查级别。本文档的 §1 适用于全部级别；§7 仅在 Standard / Release 涉及 UI 时强制启用。Light Review 仍需满足 §1 第 1 / 4 / 5 / 6 条。

---

## 9. 与 Verify 命令的关系

| 场景 | 最低验证 |
|------|----------|
| 只改 `docs/`、`AGENTS.md`、harness 文件 | `npm run verify:fast` 抽样验证（typecheck + boundaries + build） |
| 改 `packages/shared`、`packages/vue` 或 `packages/react` | `npm run verify:fast` |
| 改 `apps/docs` 或 `examples/vite-vue-admin`（含路由 / 响应式 / onboarding 视觉） | `npm run verify:fast` + `npm run verify:ui` + Browser MCP 交互 QA |
| 发版 / 公开 API / 包内容 / README 口径 | `npm run verify:release` + Browser MCP + `pack:check` + `smoke:install` |

发版前还可以用 PowerShell 入口 `.\verify.ps1`，它会按章节顺序串行跑 verify:fast / verify:ui / pack:check / smoke:install，并在结尾打印 `VERIFY OK`。
