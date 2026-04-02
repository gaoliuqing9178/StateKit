# StateKit Block Spec

## 规格目标

StateKit 的 Block 不是“一个带图标的容器”，而是对具体产品场景的预制回答。Block 规格文档的作用，是把以下三件事固定下来：

- 哪些场景是 V1 的正式范围。
- 每个 Block 允许哪些布局和覆盖项。
- 使用者应该如何写文案、放置 CTA、选择 tone。

当前规格的事实来源是 `packages/shared/src/types.ts` 与 `packages/shared/src/block-meta.ts`。

## 通用 API 合同

每个 Vue Block 都围绕同一组 props 展开。Block 组件本身只是一个带默认值的 preset，底层统一交给 `StatePresetBlock` 和 `StateBlockShell` 渲染。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 状态主标题。默认取自 Block 元数据，可被覆盖。 |
| `description` | `string` | 对状态的补充解释，建议写清下一步操作。 |
| `tone` | `neutral \| brand \| danger \| warning \| success` | 语气与强调色。默认由 Block 预设给出。 |
| `density` | `compact \| cozy \| spacious` | 控制内容松紧与媒体尺寸。 |
| `layout` | `inline \| panel \| page` | 控制 Block 在页面中的占位方式。 |
| `primaryAction` | `StateAction \| null` | 主要 CTA。传 `null` 可显式移除 preset 默认按钮。 |
| `secondaryAction` | `StateAction \| null` | 次要 CTA。传 `null` 可显式移除 preset 默认按钮。 |

`StateAction` 结构如下：

```ts
type StateActionClickHandler = (event: MouseEvent) => void | Promise<void>;

interface StateAction {
  label: string;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: StateActionClickHandler;
}
```

约束说明：

- 当前 API 最多支持两个动作按钮，没有 tertiary action。
- `href` 存在时渲染为链接；否则渲染为按钮。
- `onClick` 可用于每个动作的独立点击回调；如果同时提供 `href`，仍保持链接渲染，必要时由 consumer 自己 `event.preventDefault()`。
- `loading: true` 时按钮文案会显示为 `loadingLabel ?? "Working..."`，并阻止点击与跳转。
- `disabled: true` 时按钮同样不可交互。
- 对 preset block 传 `primaryAction: null` 或 `secondaryAction: null`，可显式隐藏默认按钮。
- `layout` 必须落在该 Block 的 `supportedLayouts` 范围内。

## Block 清单

下表描述当前 18 个已实现 Block 的用途与默认形态。

| Block ID | Vue 组件 | 类别 | 默认布局 | 支持布局 | 用途 | 优先级 |
| --- | --- | --- | --- | --- | --- | --- |
| `empty-collection` | `EmptyCollectionState` | `empty` | `panel` | `panel`, `page` | 集合还未开始创建时使用 | `backlog` |
| `empty-search` | `EmptySearchState` | `empty` | `panel` | `inline`, `panel`, `page` | 搜索或筛选结果为空 | `launch` |
| `first-project` | `FirstProjectState` | `empty` | `page` | `panel`, `page` | 首次创建项目，承担 onboarding 入口 | `launch` |
| `loading-table` | `LoadingTableState` | `loading` | `inline` | `inline`, `panel` | 表格或列表骨架加载 | `backlog` |
| `loading-workspace` | `LoadingWorkspaceState` | `loading` | `page` | `panel`, `page` | 工作区、编辑器或主画布准备中 | `backlog` |
| `loading-import` | `LoadingImportState` | `loading` | `panel` | `inline`, `panel`, `page` | 导入、同步、批处理进行中 | `backlog` |
| `inline-error` | `InlineErrorState` | `error` | `inline` | `inline`, `panel` | 局部模块加载失败 | `backlog` |
| `page-error` | `PageErrorState` | `error` | `page` | `panel`, `page` | 页面核心数据无法加载 | `launch` |
| `offline-error` | `OfflineErrorState` | `error` | `panel` | `panel`, `page` | 用户离线或网络中断 | `backlog` |
| `no-permission` | `NoPermissionState` | `permission` | `panel` | `panel`, `page` | 当前用户无权访问资源 | `launch` |
| `role-restricted` | `RoleRestrictedState` | `permission` | `inline` | `inline`, `panel` | 可查看但不可执行动作 | `backlog` |
| `session-expired` | `SessionExpiredState` | `permission` | `panel` | `panel`, `page` | 会话失效，需要重新登录 | `backlog` |
| `upgrade-plan` | `UpgradePlanState` | `upgrade` | `page` | `panel`, `page` | 功能被套餐门槛拦住 | `launch` |
| `trial-ending` | `TrialEndingState` | `upgrade` | `panel` | `panel`, `page` | 试用即将到期 | `backlog` |
| `usage-limit` | `UsageLimitState` | `upgrade` | `panel` | `inline`, `panel`, `page` | 配额或计划上限已触达 | `backlog` |
| `task-success` | `TaskSuccessState` | `success` | `page` | `panel`, `page` | 导入、导出或后台任务成功完成 | `launch` |
| `invite-success` | `InviteSuccessState` | `success` | `panel` | `panel`, `page` | 团队邀请发送成功 | `backlog` |
| `publish-success` | `PublishSuccessState` | `success` | `panel` | `panel`, `page` | 发布、配置或内容上线成功 | `backlog` |

## 类别语义

每个类别都不仅是颜色差异，还承载明确的语义预期：

- `empty`：不是故障，而是当前内容为空，需要引导开始下一步。
- `loading`：页面仍可感知结构，重点是传达“系统正在工作”。
- `error`：告诉用户出了什么问题，并给出恢复路径。
- `permission`：强调限制来自权限、角色或会话状态，而不是系统崩溃。
- `upgrade`：表达能力被计划或额度拦住，同时保留商业引导。
- `success`：用于一个明确节点完成后的确认与后续行动。

## 布局规范

### `inline`

适用于嵌入式场景：

- 表格内部
- 侧栏卡片
- 局部模块
- 操作区域内的即时反馈

使用规则：

- 内容必须短，描述尽量控制在一到两句。
- 最多保留一个关键动作，第二个动作只在确有必要时显示。
- 不要用 `inline` 承担整页阻断状态。

### `panel`

适用于大多数后台页面中的中等级别状态：

- 空列表
- 权限提示
- 配额提示
- 成功确认卡片

使用规则：

- 这是 V1 的默认布局。
- 适合卡片式承载，可放在内容区域主列中。
- 允许双按钮，但应保证主次清晰。

### `page`

适用于整页级别的强状态：

- 首次进入工作区
- 页面主数据失败
- 核心升级拦截
- 流程完成后的结果页

使用规则：

- 用于打断主流程、需要用户重新决策的节点。
- 文案可更完整，CTA 可以更明确。
- 不要把所有状态都升级成 `page`，否则产品会显得过度戏剧化。

## Tone 选择规则

- `neutral`：默认、信息性、不带强判断。
- `brand`：用于引导、激活、升级、开始新流程。
- `danger`：用于错误或失败，不用于警告型权限问题。
- `warning`：用于权限、限制、临界风险、额度提醒。
- `success`：用于确认完成或正向结果。

如果场景存在明确类别默认 tone，除非业务上有充分理由，不建议改写。尤其不要把错误态改成 `brand`，也不要把升级态改成 `danger`。

## 文案规则

标题和描述必须解决两个问题：现在发生了什么，以及用户接下来能做什么。

建议：

- 标题用结果导向短句，例如 “No results found” 或 “Upgrade to unlock this feature”。
- 描述补充上下文、边界或下一步，不要重复标题。
- 主要按钮使用明确动词，例如 `Create project`、`Reload`、`Request access`。
- 次要按钮提供低成本替代路径，例如 `Go back`、`Compare plans`、`Contact support`。

避免：

- 空泛标题，例如 “Oops” 或 “Attention”。
- 纯技术报错直接暴露给终端用户。
- 在 empty state 里使用负面责备式文案。
- 在 upgrade state 里过度营销，导致像广告而不像产品流程。

## 使用与扩展原则

- 优先复用已有 Block，而不是为每个页面新造一个名字不同、语义相同的组件。
- 如果只是文案不同，直接覆盖 props，不要新增组件。
- 如果场景语义明显不同，先在 shared 层新增 Block 元数据，再决定是否需要新组件名。
- Block 的默认值应该代表“推荐用法”，而不是随意示例文案。
