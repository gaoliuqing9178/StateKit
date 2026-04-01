# StateKit README Outline

## 目的

根目录 README 应该服务第一次打开仓库的人，而不是重复内部规划文档。因此 README 必须短、准、可执行，重点回答：

- StateKit 是什么。
- 它适合谁。
- 现在能做什么。
- 如何安装和运行。

这份 Outline 给出推荐结构，后续重写 `README.md` 与 `README.zh-CN.md` 时可直接参考。

## 推荐结构

### 1. 标题与一句话定位

推荐内容：

```md
# StateKit

Scenario-first state UI building blocks for SaaS products built with Vue.
```

中文版可写为：

```md
# StateKit

面向 SaaS 产品的场景化状态界面组件库，专注 empty / loading / error / permission / upgrade / success 等状态。
```

### 2. 什么是 StateKit

用一个短段落说明：

- 它不是通用组件库。
- 它专注状态界面与流程节点。
- 它面向 Vue 3 和 SaaS 类产品。

### 3. 覆盖的状态范围

建议用一组简短 bullets：

- Empty states
- Loading states
- Error states
- Permission states
- Upgrade states
- Success states

并补一句：onboarding first-run 场景当前通过 `first-project` 这类 empty state 处理。

### 4. 快速开始

最少包含：

```bash
npm install @statekit/vue
```

以及：

```ts
import "@statekit/vue/styles.css";
import { EmptySearchState } from "@statekit/vue";
```

再给一个极简模板示例。

### 5. 典型组件示例

推荐展示 3 到 4 个高价值 Block，而不是把 18 个全部塞进 README：

- `EmptySearchState`
- `NoPermissionState`
- `UpgradePlanState`
- `TaskSuccessState`

目标是让访问者快速理解这不是“卡片组件”，而是一套预制场景。

### 6. 仓库结构

建议给出简短 monorepo 说明：

```text
apps/docs
packages/shared
packages/vue
examples/vite-vue-admin
```

### 7. 本地开发命令

建议包含：

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

### 8. 文档与示例入口

建议直接链接或说明：

- docs 站点用于查看全部 Block 与安装说明
- example 工程用于看集成效果
- `docs/` 目录用于内部产品与实现文档

## README 写作原则

- 不要把 README 写成路线图。
- 不要复制内部文档里的大段规格说明。
- 不要使用明显的占位式 marketing 文案。
- 不要承诺当前代码中还不存在的能力，例如多框架支持、复杂主题系统、插槽扩展。

应该做到：

- 首页信息在 30 秒内可读完。
- 新用户复制安装代码后能快速跑起来。
- 中英双语 README 表意一致，但不必逐字直译。

## README.zh-CN 建议

中文 README 不应该只是英文 README 的机械翻译，建议保留以下特点：

- 直接说明它服务于 SaaS 后台、工作台、协作产品。
- 把 “状态页与流程组件” 说清楚。
- 术语保留英文状态名时，可辅以中文解释，避免语义偏差。

## 后续动作

当根 README 开始重写时，建议顺序如下：

1. 先定一句话定位。
2. 再写 quick start。
3. 最后补仓库结构和开发命令。

不要反过来先堆一堆目录说明，再让读者自己猜项目价值。
