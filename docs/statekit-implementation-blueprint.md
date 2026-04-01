# StateKit Implementation Blueprint

## 目标

这份 Blueprint 说明 StateKit 当前仓库是如何组织的，以及未来新增或修改 Block 时应该沿着什么路径改动。它的重点是“和当前实现对齐”，不是画理想化架构图。

## Monorepo 结构

```text
H:\lilProject
├─ apps
│  └─ docs                     # 文档站点，展示 Block、安装方式和示例页面
├─ examples
│  └─ vite-vue-admin           # 管理后台风格示例工程
├─ packages
│  ├─ shared                   # 类型、元数据、Block 清单与事实来源
│  └─ vue                      # Vue 组件实现与样式
└─ docs                        # 当前这组产品/实现/发布文档
```

## Workspace 责任边界

### `packages/shared`

职责：

- 定义 StateKit 的基础类型。
- 维护 `StateBlockId`、`StateCategory`、`StateTone`、`StateDensity`、`StateLayout`。
- 维护 `stateBlockMetaList`、`stateBlockMetaById`、`stateBlockMetaBySlug`。
- 明确哪些 Block 已实现、哪些属于 launch 优先级。

它是整个项目的“产品规格源”。只要 Block 名称、文案默认值、支持布局或优先级有变化，优先改这里。

### `packages/vue`

职责：

- 提供对外可直接导入的 Vue 组件。
- 使用 `StatePresetBlock` 将 shared 层的元数据映射到统一的 `StateBlockShell`。
- 提供默认样式文件 `@statekit/vue/styles.css`。

当前实现特点：

- 绝大多数 Block 组件都只是很薄的一层 preset wrapper。
- 真正决定默认内容的是 shared 元数据。
- 真正决定视觉结构的是 `StateBlockShell` 和 CSS。

### `apps/docs`

职责：

- 作为产品文档站展示 StateKit 的价值、安装方式和 Block 明细。
- 从 `@statekit/shared` 直接读取 Block 元数据。
- 从 `@statekit/vue` 读取实际组件进行 live preview。

当前站点路由：

- `/`
- `/blocks`
- `/blocks/:slug`
- `/docs/installation`
- `/examples/admin-empty-states`
- `/examples/permissions-and-upgrade`
- `/examples/task-flow`

### `examples/vite-vue-admin`

职责：

- 在相对真实的 admin shell 中演示 StateKit 的使用方式。
- 用于补齐 docs 站静态预览之外的集成感。

## 运行时数据流

当前数据流非常直接：

1. `packages/shared/src/types.ts` 定义基础类型。
2. `packages/shared/src/block-meta.ts` 定义 Block 元数据与默认值。
3. `packages/vue/src/base/StatePresetBlock.vue` 根据 `blockId` 合并默认值和外部 props。
4. `packages/vue/src/base/StateBlockShell.vue` 负责最终结构和样式语义。
5. `apps/docs` 直接消费 shared 元数据和 Vue 组件，生成列表、详情和代码片段。

这意味着 StateKit 当前是“元数据驱动的 preset 组件库”，不是一组彼此完全独立、逐个精细绘制的组件。

## 关键文件

- `packages/shared/src/types.ts`
- `packages/shared/src/block-meta.ts`
- `packages/vue/src/base/StatePresetBlock.vue`
- `packages/vue/src/base/StateBlockShell.vue`
- `packages/vue/src/index.ts`
- `apps/docs/src/lib/block-docs.ts`
- `apps/docs/src/lib/block-components.ts`
- `apps/docs/src/router.ts`

## 新增一个 Block 的标准步骤

如果要添加一个新的状态 Block，推荐按下面顺序操作。

### 1. 在 shared 层定义规格

- 为 `StateBlockId` 增加新 ID。
- 视情况决定是否需要新类别；V1 一般不建议轻易扩类别。
- 在 `stateBlockMetaList` 中添加新条目。
- 指定 `slug`、`componentName`、`summary`、`supportedLayouts` 和 `defaults`。
- 根据上线计划决定是否加入 `priorityStateBlockIds`。

### 2. 在 Vue 层暴露组件

- 新建对应的 wrapper 组件，通常只需要把 `block-id` 传给 `StatePresetBlock`。
- 在 `packages/vue/src/index.ts` 中导出该组件。

### 3. 在 docs 站接入

- `apps/docs/src/lib/block-components.ts` 中加入新组件映射。
- 确认通过 `stateBlockMetaList` 能在 Block 列表页自动出现。
- 验证详情页路由使用的 `slug` 正确可访问。

### 4. 在示例工程中校验

- 选择一个真实页面或流程，把新 Block 放进去看是否自然。
- 检查是否真的解决了某个明确场景，而不是仅仅补齐数量。

## 修改已有 Block 的原则

- 改默认文案、布局、CTA，优先改 shared 元数据。
- 改视觉结构、媒体图形、交互按钮渲染逻辑，改 `StateBlockShell` 和样式。
- 改单个组件名或导出方式，需要同步更新 docs 站中的组件映射与代码示例生成逻辑。

不要做的事：

- 不要只改 docs 文案而不更新 shared 元数据。
- 不要在单个 wrapper 组件里写和其它 Block 不一致的结构逻辑，除非已经决定让它脱离统一 Shell。
- 不要把尚未实现的能力写进 API，例如 slots、第三个 CTA、复杂插图定制。

## 当前技术边界

需要明确说明的边界如下：

- 所有 Block 共享同一套视觉外壳，类别差异主要通过 tone、背景和媒体图形体现。
- 使用者当前只能覆盖文本、布局、tone、density 和两个动作按钮。
- 没有自动化单元测试或视觉回归测试；当前验证主要依赖 `typecheck`、`build` 和人工查看 docs/example。
- docs 站内容与 shared 元数据关联紧密，因此 shared 是最重要的单一事实来源。

## 开发命令

在仓库根目录可用的主要命令：

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

建议的日常改动流程：

1. 修改 `shared` 或 `vue`。
2. 打开 docs 站检查 Block 列表页和详情页。
3. 打开 example 工程看集成效果。
4. 运行 `npm run typecheck` 与 `npm run build`。

## 后续实现建议

如果未来需要提升可维护性，优先级建议如下：

- 为 docs 增加截图级或 DOM 级回归测试。
- 减少 docs 站中手写组件映射的重复维护成本。
- 视需要把 “类别默认图形” 与 “个别 Block 专属图形” 解耦。
- 在不破坏 V1 简洁 API 的前提下逐步引入更强的扩展能力。
