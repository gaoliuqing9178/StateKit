# Runbook · 排障

> 这份文件是排障的**入口**。具体细节按链接深入。
>
> 任何一个 agent 在某一步卡住后，先来这里查；查不到就**记一条到 `progress.md` 给下一轮**，不要硬猜。

---

## 冷启动失败

### `node` 版本不够

**症状**：`init.ps1` 第一步报 `[错误] 未找到 Node.js` 或版本过低。

**修复**：StateKit 要求 Node ≥ 18（推荐 20+）。从 https://nodejs.org/ 装新版后重新跑 `.\init.ps1`。Windows 也可以用 `nvm-windows` 切换版本。

### `npm install` 卡死或报 `EPERM`

**症状**：依赖装到一半卡住，或 Windows 上报权限错误。

**修复**：

1. 关掉占用 `node_modules` 的进程（vite dev server、playwright 进程）。
2. 删 `node_modules` 和 `package-lock.json` 之外的子 workspace 安装产物（**保留**根 lockfile）。
3. 重跑 `npm install`。
4. 仍失败 → 看是不是 Windows Defender 或公司代理在拦，临时关掉再试。

### Playwright 浏览器没装

**症状**：`npm run test:ui` 报 `browserType.launch: Executable doesn't exist`。

**修复**：

```bash
npx playwright install chromium
```

只装 chromium 即可，StateKit 当前 Playwright config 只跑 chromium。

---

## verify 链失败

### `lint:boundaries` 报错

**症状**：`scripts/check-boundaries.mjs` 报"违反依赖方向"。

**修复**：错误信息会带 `rule / message / fix` 三段，按 `fix` 改即可。常见情况：

- `apps/docs/src` 直接 import `packages/vue/src/...` → 改成走 `@statekit-vue/vue` 公开入口。
- `examples/vite-vue-admin/src` 直接 import `packages/shared/src/...` → 改成走 `@statekit-vue/vue`（example 像真实消费者）。
- `packages/shared/src` 引入 Vue → 框架中立层不允许，要么挪到 `packages/vue`，要么放 `apps/docs/src/lib`。

### `typecheck` 报错

**症状**：`vue-tsc` 报类型不匹配。

**修复**：

- 不要用 `any` 或 `@ts-ignore`（lint 会再红一次）。
- recipe metadata 的真理在 `packages/shared/src/types.ts`。
- Vue 组件 props 类型对不上时，先看 `packages/vue/src/base/StatePresetBlock.vue` 的 props 定义。

### `test:unit` 报错

**症状**：`vitest run` 失败。

**修复**：

- jsdom 环境没初始化 → 看 `vitest.config.ts` 的 `environment` 配置。
- snapshot 不匹配 → **不要**用 `--update` 一键覆盖。先看是 recipe metadata 改了还是渲染出 bug。

### `test:ui` 报错

**症状**：Playwright 端到端测试失败。

**修复**：

1. 先看 `test-results/<spec>/error-context.md` 拿到失败的具体 selector。
2. 用 `data-testid` 锚点比文案锚点稳定。
3. dev server 起不来：看 `playwright.config.ts` 的 `webServer` 段，docs 默认 `http://127.0.0.1:4173`，example 默认 `http://127.0.0.1:4273`。端口被占就 `taskkill /PID <pid>` 释放后重跑。
4. trace 在 `test-results/<spec>/trace.zip`，用 `npx playwright show-trace` 打开。

### `pack:check` 报错

**症状**：`npm pack --dry-run` 输出包内容里出现不该有的文件（`*.test.ts`、源码 .vue 等）。

**修复**：

- shared / vue 的 `package.json` 里 `files` 字段限定发布范围。
- `tsconfig.build.json` 必须 `exclude` 测试文件。
- 不要回退到 `"files": ["src", "dist"]` 这种宽松写法。

### `smoke:install` 报错

**症状**：`scripts/smoke-install.mjs` 在临时目录里安装本地 tarball 失败。

**修复**：

- 先确认 `pack:check` 通过了。
- 检查临时目录路径有没有空格或中文（Windows 上偶尔踩）。
- 看 `dist/` 是不是真有产物 —— 没跑 `npm run build` 的话 tarball 是空的。

---

## 运行时排障

### docs 站白屏 / 报路由错

**症状**：`/`、`/recipes`、`/recipes/<slug>`、`/zh-CN/...` 任意路径白屏。

**修复**：

1. 看 console 是不是 `vue-router` "No match" → 路由表 `apps/docs/src/router.ts` 没同步。
2. 是不是 recipe slug 改名后 `apps/docs/src/lib/recipe-docs.ts` 没跟上。
3. 中文 locale 出问题：`apps/docs/src/lib/recipe-display-zh.ts` 是不是没补对应条目。

### example app onboarding 链路断

**症状**：`examples/vite-vue-admin` 的 onboarding-to-completion 串不起来。

**修复**：

- App.vue 里步骤切换是本地 state，不是路由。先看 `examples/vite-vue-admin/src/App.vue` 的 `currentStep`。
- 7 个 category-first 入口的渲染依赖 `@statekit-vue/vue`，example 不能直连 `packages/`，所以一定要跑 `npm run build --workspace @statekit-vue/vue` 之后才能拿到最新代码。

### onboarding stat value 越界（mobile）

**症状**：`Workspace` 这种长字符在 stat 卡片右边溢出。

**修复**：见 `progress.md#2026-05-09`，已在 `packages/vue/src/styles/base.css` 的 `.sk-onboarding-media__stat strong` 处理过。再发生说明 CSS 被回滚了。

---

## Browser MCP 排障

### MCP 拿不到页面 snapshot

**症状**：`mcp__chrome-devtools__take_snapshot` 或 `mcp__playwright__browser_snapshot` 返回空。

**修复**：

- 当前 Codex agent 不能自己跑 Browser MCP（沙箱里没有 browser 进程）。让宿主环境另起一个新 Codex 终端，等 MCP 初始化完。详见 `docs/statekit-agent-harness.md` 第 4 节。
- 端口冲突：docs `:4173` / example `:4273` 已经被占 → 先 `npm run dev:docs` / `npm run dev:example` 看是不是已经在跑，复用即可。

### console error / warning 出现新的看不懂的告警

**症状**：Browser MCP 抓到没在 `docs/quality.md §7.3` 表里的告警。

**修复**：

- 不要直接判"可忽略"。
- 在 `qa/<sprint-id>-evaluator-report.md` 的 `## 控制台日志审查` 里如实列出，按规程判 阻塞 / 非阻塞 / 可忽略。
- 如果要新增"可忽略"白名单条目，必须走 `docs/decision-log.md` 登记，不能 agent 自己加。

---

## 找不到答案

把"我在 X 步卡住了，做了 Y，期望 A 实际 B"写到 `progress.md` 当前轮次条目里，**留给下一轮**。不要硬猜，不要回退别人 `passes: true` 的功能凑结果。
