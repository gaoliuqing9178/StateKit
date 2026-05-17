# StateKit Agent Harness

这份文档把 StateKit 仓库配置成更适合 AI agent 接手的工作环境。目标不是让 agent 随便生成更多代码，而是让它能按固定路径读取事实、执行验证、理解失败并收束改动。

## 目标

- 给 agent 一个短入口：根目录 `AGENTS.md`。
- 把项目事实放进 `docs/`，避免依赖聊天记录或人脑记忆。
- 把验证动作收口成稳定命令，方便 agent 自己循环。
- 明确 StateKit 的架构边界，减少无关重构和 API 膨胀。
- 用机械 lint 检查 workspace 依赖方向，减少依赖人工记忆维护边界。
- 把测试失败、文档同步、发布验证都写成可执行规则。

## Harness 分层

### 1. 入口地图

入口文件是根目录 `AGENTS.md`。它只回答三个问题：

- 先读哪些文档。
- 当前公开面和模块边界是什么。
- 做完后跑哪些命令。

不要把所有细节塞进 `AGENTS.md`。细节应该继续放在 `docs/` 里。

### 2. 仓库事实来源

StateKit 当前事实来源按优先级分层：

1. `packages/shared/src/types.ts` 和 `packages/shared/src/block-meta.ts`
   公开类型、category、recipe metadata 的源码事实。
2. `packages/vue/src/base/StatePresetBlock.vue` 和 `packages/vue/src/base/StateBlockShell.vue`
   Vue 渲染合同、fallback、action 合并、shell 布局事实。
3. `feature_list.json`
   功能清单、验收状态、evaluator 与 evidence 的结构化事实。
4. `docs/handoff.md`
   当前轮次交接、下一轮优先事项和已知风险。
5. `progress.md`
   历史轮次记录、验证记录和 Browser MCP 证据线索。
6. `docs/README.md`
   文档目录和阅读顺序。

如果文档和源码冲突，先以源码为准，再同步文档。

### 3. 验证命令

根目录 `package.json` 提供三层验证：

```bash
npm run lint:boundaries
```

用于单独检查框架与 workspace 依赖边界，覆盖源码 import 和各 workspace `package.json` 依赖声明。

```bash
npm run verify:fast
```

用于普通实现任务，包含依赖边界 lint、类型检查、单元测试和构建。

```bash
npm run verify:ui
```

用于 docs 站、示例页、路由、移动端布局和 onboarding 语义相关任务。

Browser MCP 交互 QA 是 `verify:ui` 之后的人工浏览器检查层，不是 npm script。涉及可见 UI、路由、响应式、onboarding、example app 或用户明确指出页面问题时，Builder 需要用 Playwright MCP 和 Chrome DevTools MCP 直接打开本地页面、点击关键路径、检查 console/network，并记录证据。

```bash
npm run verify:release
```

用于发版前或公开 API 变化，包含类型检查、构建、单元测试、UI 测试、包内容检查和外部安装烟测。

`npm run verify` 默认等同于 `npm run verify:release`。

### 4. Codex 环境下的测试执行规则

**同一个 Codex agent 不能自己写代码又自己跑 Browser MCP 测试。**

这条规则的底层逻辑是：Codex agent 在沙箱里执行，无法访问宿主机上的 browser 进程和 MCP 工具。如果同一个 agent 自己写完代码又自己宣布"Browser MCP 检查通过"，结论没有实际证据支撑。

**正确的分工方式：**

1. **编码 agent（Builder）**：完成代码改动，运行 `verify:fast`，记录改动范围和需要验证的用户路径，写入 `progress.md`。编码 agent 可以运行 `npm run test:ui`（Playwright 自动化），因为 Playwright 会自动启动 dev server，不依赖宿主 browser 进程。

2. **测试 agent（QA Terminal）**：由**宿主环境**另起一个新的 Codex 终端，等待 MCP 工具（Playwright MCP 和 Chrome DevTools MCP）初始化完成后，再执行 Browser MCP 交互 QA。

**宿主环境操作步骤：**

```
1. 确认编码 agent 已完成代码改动并运行过 verify:fast
2. 在宿主机上另起一个新的 Codex 终端（独立 session）
3. 等待该终端的 Playwright MCP 和 Chrome DevTools MCP 初始化完成
4. 在新终端里按 docs/statekit-agent-harness.md 第 5 节的步骤执行 Browser MCP QA
5. 把 QA 结果（URL、视口、截图路径、console/network 结论）写回 progress.md 或 agent-task-template 的完成记录
```

**什么情况下必须走新 Codex 终端：**

- 涉及可见 UI、路由、响应式、onboarding 语义或 example app 的改动
- docs 示例页或 example app 视觉有变化
- 用户指出了具体页面问题需要确认

**什么情况下编码 agent 可以自己验证：**

- 只改内部文档或 harness 脚本（Light Review）
- 只改 `packages/shared` 或 `packages/vue` 逻辑（`npm run verify:fast` 足够）
- 运行 `npm run test:ui`（Playwright 自动化，不依赖宿主 browser 进程）

### 5. 运行时可读性

`apps/docs` 是当前最重要的运行时 QA 目录。Playwright 通过 `playwright.config.ts` 同时启动 docs 站和 `examples/vite-vue-admin`，并在 Chromium 下执行 `apps/docs/tests` 中的主路径与真实集成示例测试。

维护测试时优先遵守这些约束：

- 使用稳定 `data-testid` 锚点。
- 断言具体用户路径，而不是大段文案。
- 对 disabled 按钮使用语义断言。
- 跨路由后重新获取 locator。
- 移动端测试关注无横向溢出、导航可用、onboarding 堆叠和详情页单列布局。

Browser MCP 交互 QA 用来覆盖自动化断言之外的真实浏览器感知：

1. 启动或复用本地服务：docs 默认 `http://127.0.0.1:4173/`，example 默认 `http://127.0.0.1:4273/`。如果端口被占用，记录实际端口。
2. 用 Playwright MCP 打开目标页面，跑至少一个真实用户路径：导航、点击 CTA、等待状态变化、切换手机视口，并用 `document.documentElement.scrollWidth <= window.innerWidth + 1` 检查无横向溢出。
3. 用 Chrome DevTools MCP 打开同一目标或真实 example app，读取 accessibility snapshot，点击关键交互，检查 console error/warning 和主要 document/script/stylesheet 请求状态。
4. 对视觉或布局改动，保存至少一张截图到 `.agent/`，并在最终回复或 review 输入里写明截图路径。
5. 如果 MCP 不可用，说明不可用原因；不能把“没有做浏览器 MCP 检查”写成已经完成。

### 6. 架构边界

默认修改顺序是：

1. `packages/shared`
2. `packages/vue`
3. `apps/docs`
4. `examples/vite-vue-admin`
5. README、package README、交接文档和 checklist

新增场景时优先扩 `packages/shared/src/block-meta.ts` 中的 recipe，再同步 Vue、docs 和 example。只有当多个高频场景都明显不适合现有 7 个 category 时，才讨论新增第 8 类入口。

`npm run lint:boundaries` 会机械检查这些依赖方向：

- `packages/shared/src` 保持框架中立，不依赖 Vue、Vue Router、Vue 测试工具、Vue package、docs 或 example。
- `packages/vue/src` 可以依赖 `@statekit-vue/shared` 和 Vue，但不能依赖 docs 或 example。
- `apps/docs/src` 通过公开包入口依赖 shared 和 Vue package，不能依赖 example 或直接穿透 workspace 源码路径。
- `examples/vite-vue-admin/src` 像真实消费者一样只通过 `@statekit-vue/vue` 使用 StateKit，不能直接依赖 shared、docs 或 workspace 源码路径。

不要把 StateKit 做成：

- 通用组件库
- 页面搭建器
- 高度自由的 slot 系统
- 每个场景一个公开组件名的 API

### 7. 文档同步规则

如果改动影响公开行为，至少检查这些文件：

- `README.md`
- `README.zh-CN.md`
- `packages/vue/README.md`
- `packages/shared/README.md`
- `docs/README.md`
- `docs/handoff.md`
- `feature_list.json`
- `docs/statekit-launch-checklist.md`
- `docs/交接/CHANGELOG.md`

如果只是内部 harness 文档或验证脚本变化，不要把它写成产品功能发布；可以同步 `docs/README.md`、`docs/handoff.md` 和 `progress.md`，让后续 agent 能发现。

## Agent 工作循环

推荐每个任务按这个顺序执行：

1. 读取 `AGENTS.md` 和相关 docs。
2. 用源码确认文档中的事实是否仍然成立。
3. 写一个很小的执行计划，说明修改范围和验证命令。
4. 只改与任务直接相关的文件。
5. 运行对应验证命令。
6. 涉及可见 UI 时，在自动化验证后执行 Browser MCP 交互 QA。
7. 如果失败，先记录失败命令、失败现象和初步原因。
8. 修复后重新运行同一验证和相关 Browser MCP 检查。
9. 如果公开行为变化，同步文档和交接文件。
10. 最终说明改了什么、跑了什么、浏览器实际检查了什么、还有什么风险。

## 任务模板

复杂任务可以复制 `docs/agent-task-template.md`，在任务开始时生成一份临时计划。计划应该随着实现更新，但不要把已经完成的旧验证重复留成开放 TODO。

## Review Loop

较大任务或高风险任务应走双 agent review loop：

1. Builder Agent 完成改动。
2. Builder 运行对应验证命令。
3. Builder 运行 `npm run review:bundle` 生成 `.agent/review-bundle.md`。
4. Reviewer Agent 按 `docs/agent-review-loop.md` 和 `docs/agent-review-template.md` 审查 diff。
5. Builder 逐条回应 findings。
6. Builder 修复后重新运行验证。

Review level 按风险选择：

- `Light`：内部文档和 harness 小改动。
- `Standard`：packages、docs、example、测试、路由、recipe metadata 改动。
- `Release`：版本号、公开 API、README、包内容、CI 和发布链路改动。

Reviewer 不负责实现新功能，只负责发现真实问题。没有 blocking 或 major finding 时，应明确给出 `Approved` 或 `Approved with minor notes`。

## 当前缺口

- 依赖边界已有基础架构 linter：`npm run lint:boundaries`。它覆盖静态 import 和 package manifest，不替代更完整的循环依赖、bundle 体积或运行时行为分析。
- 还没有视觉像素级回归测试，插图细节仍需要人工浏览确认。
- docs 站的分类文案已集中到 `apps/docs/src/lib/category-docs.ts`，但新增 recipe 时仍要确认首页、列表页和详情页是否自动吃到同一份分类标签和说明。

这些缺口不阻塞当前 harness 使用。Browser MCP 交互 QA 是当前替代像素级回归的最低人工浏览器证据。后续如果继续强化 agent 自主性，优先把文档新鲜度检查、循环依赖分析、截图比对和更细的包产物检查做成脚本或 lint 规则。
