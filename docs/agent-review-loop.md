# StateKit Agent Review Loop

这份文档定义 StateKit 的双 agent 审查循环。目标是让实现 agent 和审查 agent 分工清楚，形成可重复的反馈闭环，而不是让第二个 agent 泛泛提建议。

## 角色

### Coordinator

通常由当前主 agent 或人类承担。负责定义任务目标、选择 review level、收集验证结果，并决定是否需要人类判断。

### Builder Agent

负责实现改动。Builder 只改任务范围内的文件，运行对应验证命令，并把失败原因记录清楚。

### Reviewer Agent

负责审查，不负责重新实现。Reviewer 只报告真实风险：bug、行为回归、公开 API 破坏、文档口径分叉、测试缺口、验证不足。

### Human Gate

只处理需要产品判断、视觉主观判断、API 取舍、发布风险确认的问题。普通代码修复不应默认升级给人类。

## Review Levels

### Light Review

适用场景：

- 只改内部文档。
- 只改 harness 文档或模板。
- 不影响公开 API、运行时代码、测试和发布链路。

输入材料：

- 任务目标。
- `git diff`。
- 已运行或不需要运行的验证说明。

最低验证：

- 文档链接和 JSON 配置可读。
- 如果改了 `package.json`，至少运行相关新增脚本。

### Standard Review

适用场景：

- 修改 `packages/shared`、`packages/vue`、`apps/docs`、`examples/vite-vue-admin`。
- 修改测试、docs 示例页、路由或响应式行为。
- 修改 recipe metadata、category 文案或 docs QA 面板。

输入材料：

- 任务目标。
- `AGENTS.md`。
- `docs/statekit-agent-harness.md`。
- `docs/agent-review-template.md`。
- 当前 `git diff`。
- 相关源码和测试。
- `npm run verify:fast` 结果，其中已经包含 `npm run lint:boundaries`。
- 如果涉及 docs UI，再提供 `npm run verify:ui` 结果。
- 如果涉及可见 UI、响应式、路由、onboarding 或 example app，再提供 Browser MCP 交互 QA 记录：实际 URL、视口、点击路径、状态变化、console/network 检查结果和截图路径。

最低验证：

```bash
npm run verify:fast
```

这一步会先运行框架与 workspace 依赖边界 lint，再运行类型检查、单元测试和构建。

涉及 docs UI 时再运行：

```bash
npm run verify:ui
```

涉及可见 UI 时，再补充 Browser MCP 交互 QA。最低检查是：

- Playwright MCP 打开目标页面，点击一条关键用户路径，并至少检查一次桌面或手机视口的无横向溢出。
- Chrome DevTools MCP 打开同一页面或真实 example app，查看 accessibility snapshot、console error/warning、主要 network 请求，并保存必要截图到 `.agent/`。

### Release Review

适用场景：

- 修改版本号、公开 API、recipe/category 数量、README、package README、发布 checklist 或包内容。
- 准备 npm 发布。
- 修改 `pack:check`、`smoke:install` 或 CI gate。

输入材料：

- Standard Review 的全部材料。
- `docs/交接/CHANGELOG.md`。
- `feature_list.json`。
- `docs/handoff.md`。
- `docs/statekit-launch-checklist.md`。
- `npm run verify:release` 结果。
- 如果 release 改动影响页面、docs、example 或视觉语义，附 Browser MCP 交互 QA 记录和截图路径。

最低验证：

```bash
npm run verify:release
```

## 状态流转

推荐每个较大任务按这个状态前进：

1. `Draft`
2. `Builder Complete`
3. `Local Verified`
4. `Review Requested`
5. `Changes Requested` 或 `Reviewer Approved`
6. `Builder Fixed`
7. `Re-verified`
8. `Reviewer Approved`
9. `Human Final Check`

`Local Verified` 对 UI 任务同时包含命令验证和 Browser MCP 交互 QA。Reviewer 给出 `Approved` 时，可以跳过第 6 和第 7 步。如果 Reviewer 给出 `Changes requested`，Builder 必须逐条回应。

## 生成 Reviewer 输入包

运行：

```bash
npm run review:bundle
```

默认输出：

```txt
.agent/review-bundle.md
```

这个文件会收集当前 git status、changed files、untracked files、diff stat、unstaged diff、staged diff 和小型未跟踪文本文件内容。`.agent/` 已被 `.gitignore` 忽略，输入包不会进入提交。

如果需要写到其他位置：

```bash
node ./scripts/agent-review-bundle.mjs path/to/review-bundle.md
```

生成后，把 `Task Goal`、`Review level` 和已运行验证补进去，再交给 Reviewer Agent。

如果本轮是 UI 任务，还要补齐：

- Browser MCP QA：
  - Playwright MCP：
  - Chrome DevTools MCP：
  - Screenshots：
  - Console/network notes：

## Reviewer 规则

Reviewer 必须遵守：

- 先列问题，不写泛泛鼓励。
- 每条 finding 必须落到文件、行号、行为或测试缺口。
- 不把个人风格偏好包装成问题。
- 不要求无关重构。
- 不重复列已经通过且没有风险信号的验证。
- 如果没有发现问题，明确说没有 blocking 或 major finding。

Reviewer 不应该做：

- 不直接改代码。
- 不扩大任务范围。
- 不把 StateKit 扩成通用组件库、页面搭建器或多框架库。
- 不建议新增顶层公开入口，除非多个高频场景都明显不适合现有 7 个 category。

## Builder 回应规则

Builder 收到 review 后必须逐条处理：

- 真实问题：修复并说明改动位置。
- 不成立的问题：引用源码、测试或文档说明为什么不成立。
- 需要人类判断的问题：放到 `Open Questions`，不要擅自决定。

修复后重新运行对应验证命令，并说明是否产生新的风险。

## 记录方式

复杂任务可以在任务计划或 PR 描述中记录 review round：

```md
## Review Round 1

Reviewer verdict: Changes requested

Findings:
- Major: ...

Builder response:
- Fixed ...

Verification:
- npm run verify:fast passed
```

不要把已经关闭的问题继续留成开放 TODO。
