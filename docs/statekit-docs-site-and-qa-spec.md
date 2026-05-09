# StateKit Docs Site And QA Spec

## 目的

`apps/docs` 不是一个简单的 demo，它承担三项职责：

- 让首次接触 StateKit 的人快速理解产品定位。
- 让使用者能找到合适的 Block，并看到真实预览。
- 作为发布前人工 QA 的主要观察面板，同时也是 Playwright 自动化回归的测试宿主。

因此 docs 站的内容必须和 shared 元数据、Vue 组件导出保持同步。

## 当前信息架构

根据现有路由，docs 站包含以下页面：

| 路径 | 页面职责 |
| --- | --- |
| `/` | 首页，介绍 StateKit 定位、展示 featured blocks、跳转示例页 |
| `/zh-CN` | 中文首页，与英文首页共享同一套信息架构和 shared 元数据 |
| `/recipes` | Recipe 总览列表页 |
| `/zh-CN/recipes` | 中文 Recipe 总览列表页 |
| `/recipes/:slug` | 单个 Recipe 详情页，包含 live preview、元数据、代码片段 |
| `/zh-CN/recipes/:slug` | 中文 Recipe 详情页，slug、组件名、priority、布局等 API 事实保持原样，面向读者的说明和示例文案本地化 |
| `/blocks` | 兼容重定向 → `/recipes` |
| `/blocks/:slug` | 兼容重定向 → `/recipes/:slug` |
| `/zh-CN/blocks` | 兼容重定向 → `/zh-CN/recipes` |
| `/zh-CN/blocks/:slug` | 兼容重定向 → `/zh-CN/recipes/:slug` |
| `/docs/installation` | 安装与最小接入说明 |
| `/zh-CN/docs/installation` | 中文安装与最小接入说明 |
| `/examples` | 重定向 → `/examples/onboarding-activation` |
| `/zh-CN/examples` | 重定向 → `/zh-CN/examples/onboarding-activation` |
| `/examples/onboarding-activation` | 示例页，展示完整 first-run 激活流程（workspace → 成员 → 集成 → 完成） |
| `/zh-CN/examples/onboarding-activation` | 中文示例页入口，保留同一交互示例 |
| `/examples/admin-empty-states` | 示例页，展示 empty 与 onboarding 状态在后台中的组合 |
| `/zh-CN/examples/admin-empty-states` | 中文示例页入口，保留同一交互示例 |
| `/examples/permissions-and-upgrade` | 示例页，展示权限与升级场景 |
| `/zh-CN/examples/permissions-and-upgrade` | 中文示例页入口，保留同一交互示例 |
| `/examples/task-flow` | 示例页，展示 loading / error / success 流程串联 |
| `/zh-CN/examples/task-flow` | 中文示例页入口，保留同一交互示例 |

## 本地化约束

docs 站当前支持英文默认路径和 `/zh-CN` 中文路径。维护时注意：

- 英文路径保持原有 URL，不加 locale 前缀。
- 中文路径统一加 `/zh-CN` 前缀。
- 语言切换应尽量保留当前页面，例如 `/recipes/page-error-state` ↔ `/zh-CN/recipes/page-error-state`。
- Recipe 的 `slug`、`componentName`、`priority`、`tone`、`density`、`layout` 等 API 事实不翻译；面向读者的标题、摘要、说明、CTA 示例可以本地化。
- 中文 recipe 展示层来自 docs 本地本地化映射，不改变 `packages/shared/src/block-meta.ts` 中的真实默认 metadata。
- 示例页中文版本优先保证入口标题、说明、导航和关键路径本地化；交互示例可以继续保留英文业务文案，避免把组件库默认英文 API 与中文展示层混淆。

## 页面要求

### 首页

首页至少要解决三件事：

- StateKit 是什么。
- 它覆盖哪些状态类型。
- 访问者下一步去哪里看安装、Block 列表或示例页面。

现有首页已经有这套基本骨架，后续维护时不要把首页改成纯 marketing copy，而失去产品导航功能。

### Recipe 列表页

Recipe 列表页必须：

- 覆盖全部 `stateBlockMetaList`。
- 明确展示类别、标题、摘要和支持布局。
- 允许使用者快速比较相似场景，例如 `page-error` 和 `inline-error`。

### Recipe 详情页

每个 Recipe 详情页至少包含：

- 标题与摘要
- live preview
- `slug`
- 组件名
- 优先级
- 支持布局
- 可直接复制的使用示例代码

详情页的数据必须优先来自 shared 元数据，而不是在 docs 站本地重复写一份。

### Installation 页

安装页必须回答以下问题：

- 包怎么装。
- 样式怎么引。
- 一个最基本的使用示例是什么。

如果未来 README 与 docs 安装页内容出现冲突，以 docs 安装页为先，再回修 README。

### Example 页

示例页的目标不是把所有 Block 摆成 gallery，而是展示它们在产品流程里的上下文。每个示例页都应满足：

- 至少有一个明确用户任务。
- Block 放在合理位置，而不是脱离页面结构单独居中。
- 能体现为什么这个 Block 适合该场景。

当前四个示例页：

- `/examples/onboarding-activation`：first-run 激活流程的端到端示范（默认入口）。
- `/examples/admin-empty-states`：后台空状态与 onboarding 状态的组合使用。
- `/examples/permissions-and-upgrade`：权限限制与升级引导场景。
- `/examples/task-flow`：loading → error → success 流程串联。

## QA 原则

docs 站是最重要的人工 QA 面板。同时，`apps/docs/tests/` 下已有 12 个 Playwright spec 文件覆盖主路径、移动端断点、中文 locale 和 example 集成面，提供基础自动化回归。自动化测试通过后，仍需人工确认视觉质量。

### Browser MCP 交互 QA

当改动涉及 docs、example、路由、响应式、onboarding、视觉层级或用户可点击交互时，除了 `npm run test:ui`，还要用浏览器 MCP 直接检查页面。这个流程是测试循环的一部分，但不是 npm script。

#### 适用场景

- 修 docs 站或 example app 的页面布局、样式、交互、路由。
- 修改 `packages/vue/src/styles/` 或影响 `StateBlockShell`、`OnboardingState`、action slot、响应式行为。
- 修复用户指出的页面错位、裁切、按钮异常、动效或移动端问题。
- Reviewer 要求补充真实浏览器证据。

#### 推荐本地目标

- docs 站：`http://127.0.0.1:4173/`
- 真实集成 example：`http://127.0.0.1:4273/`

如果端口被占用，Vite 可能切到 `4174`、`4274` 或其他端口。记录实际使用的 URL，不要只写默认端口。

#### Playwright MCP 检查

用 Playwright MCP 覆盖用户路径和视口：

- 打开目标页面，确认 title 和主要 landmark 可读。
- 点击至少一条关键路径，例如 nav、recipe card、primary CTA、reopen/skip/action 按钮。
- 对状态型交互，记录点击前后的可见状态变化，例如 loading label、closed panel、计数变化、按钮 disabled。
- 桌面和手机至少检查一个相关视口；响应式或移动端改动必须检查手机宽度。
- 用页面 evaluate 检查无横向溢出：

```js
document.documentElement.scrollWidth <= window.innerWidth + 1
```

#### Chrome DevTools MCP 检查

用 Chrome DevTools MCP 覆盖浏览器层面的可观察风险：

- 读取 accessibility snapshot，确认关键标题、按钮、链接能被浏览器看到。
- 点击关键按钮或链接，确认 snapshot 中出现预期状态。
- 查看 console error/warning。`favicon.ico` 404 可以记录为非业务错误；脚本错误、组件 warning、hydration 或资源加载失败需要处理。
- 查看主要 network 请求，至少确认 document、script、stylesheet 返回正常状态。
- 对视觉或布局改动保存截图到 `.agent/`，命名应能说明页面和状态，例如 `.agent/example-onboarding-fixed.png`。

#### 记录格式

最终回复、任务模板或 review bundle 中至少记录：

```md
Browser MCP QA:
- Playwright MCP: URL, viewport, clicked path, observed state, overflow result
- Chrome DevTools MCP: URL, snapshot target, console/network result
- Screenshots: .agent/...
- Notes: known non-business warnings or skipped checks
```

如果 Browser MCP 不可用，说明具体原因和替代检查。不要把未执行的 MCP 检查写成通过。

### 基础检查

- 首页、列表页、详情页和安装页都可正常访问。
- 每个 `slug` 都能打开对应详情页，没有 404。
- 详情页展示的组件名和 shared 元数据一致。
- 使用示例代码中的组件名与实际导出名一致。

### 视觉检查

- `inline`、`panel`、`page` 三种布局在桌面端和窄屏下都可读。
- `compact`、`cozy`、`spacious` 的内边距和媒体尺寸差异明显但不过激。
- `danger`、`warning`、`success` 等 tone 的语义与场景一致。
- loading 动画在允许动效场景下正常工作，在窄屏下没有错位。

### 内容检查

- Block 标题、描述和 CTA 没有明显占位词或示例假文案味道。
- featured blocks 与 `priorityStateBlockIds` 保持一致。
- 首页文案、安装页文案和根 README 的主张不互相冲突。

### 交互检查

- 有 `href` 的 action 渲染为链接，没有 `href` 的渲染为按钮。
- `onClick` action 可正常触发；如果同时提供 `href`，仍保持链接语义。
- `loading` action 会显示 `loadingLabel ?? "Working..."`，并阻止重复点击或跳转。
- 对 preset 传入 `primaryAction: null` 或 `secondaryAction: null` 时，默认按钮会被显式移除。
- `disabled` 与 `loading` 动作都有明显的不可交互视觉状态，包含灰态或 cursor 变化。
- 次按钮样式与主按钮明显区分。
- 移动端按钮会纵向堆叠，点击区域足够。

## 建议的 QA 场景矩阵

每次视觉或结构改动时，至少人工检查以下几类代表 Block：

| 代表 Block | 检查重点 |
| --- | --- |
| `empty-search` | 空结果语义是否清晰，`inline/panel/page` 是否都成立 |
| `onboarding-workspace` | `page + spacious + brand` 是否足够像首次启动入口，而不是普通 empty state |
| `first-project` | 是否已经更清楚地表达"工作区已存在，但还没有首个项目" |
| `page-error` | 整页错误是否有明确恢复动作 |
| `no-permission` | `warning` 语气是否准确，不像系统崩溃 |
| `upgrade-plan` | 商业引导是否自然，不像广告 Banner |
| `task-success` | 成功完成感是否明确，后续动作是否清晰 |

## 发布前最小验收

在计划对外展示或发布前，docs 站至少要满足：

- `npm run dev:docs` 可启动。
- `npm run build --workspace @statekit/docs` 通过。
- `npm run test:ui` 通过（12 个 Playwright spec）。
- Block 列表数量与 shared 中一致。
- 每个 launch 级 Block 都有可访问详情页。
- Installation 页能让新用户完成最基本接入。

## 当前缺口

这部分需要诚实记录，而不是在发布前假装不存在：

- 已有 Playwright 自动化覆盖主路径和移动端断点，但暂无像素级视觉回归；插图细节仍需人工确认。
- docs 站的组件映射仍是手工维护的（`recipe-components.ts`）。
- 示例页产品流程的覆盖密度还有提升空间，尤其是 permissions-and-upgrade 和 task-flow 示例页的叙事深度。
