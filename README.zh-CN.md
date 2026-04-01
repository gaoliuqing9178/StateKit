# StateKit

面向 SaaS 产品的场景化状态界面组件库，基于 Vue 构建。

[English](./README.md)

StateKit 专做产品里最常见、也最容易被草率处理的状态界面：empty、loading、error、permission、upgrade、onboarding 风格的 first-run 状态，以及 success 结果态。它不是按钮、表单、弹窗这类通用 UI 组件库，而是专门解决“状态页与流程组件”这一层的问题。

## 它解决什么

- Empty states
- Loading states
- Error states
- Permission states
- Upgrade states
- Success states

当前 V1 已经提供 18 个预制 Block，覆盖以上 6 个类别。严格意义上的 onboarding 类别还没有单独拆出，目前通过 `FirstProjectState` 这类 first-run empty state 来承接首次进入和激活引导。

## 快速开始

```bash
npm install @statekit/vue
```

```vue
<script setup lang="ts">
import "@statekit/vue/styles.css";
import { EmptySearchState } from "@statekit/vue";
</script>

<template>
  <EmptySearchState
    title="没有找到匹配的发票"
    description="试试更换关键词，或先清除当前筛选条件。"
    :primary-action="{ label: '清除筛选' }"
    :secondary-action="{ label: '新建发票' }"
  />
</template>
```

## 代表性组件

当前最能体现 StateKit 价值的一组预制状态组件：

- `EmptySearchState`
- `FirstProjectState`
- `PageErrorState`
- `NoPermissionState`
- `UpgradePlanState`
- `TaskSuccessState`

所有 Block 共享同一套核心 API：

- `title`
- `description`
- `tone`
- `density`
- `layout`
- `primaryAction`
- `secondaryAction`

支持的布局：

- `inline`
- `panel`
- `page`

支持的 tone：

- `neutral`
- `brand`
- `danger`
- `warning`
- `success`

## 仓库结构

```text
apps/docs
packages/shared
packages/vue
examples/vite-vue-admin
docs
```

- `packages/shared`：共享类型、Block 元数据、ID、分类和默认值。
- `packages/vue`：Vue 组件实现与默认样式。
- `apps/docs`：本地文档站，用来浏览 Block、查看安装方式和 live preview。
- `examples/vite-vue-admin`：管理后台风格的集成示例。
- `docs`：项目内部的产品、实现、QA 和发布文档。

## 本地开发

在仓库根目录运行：

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

## 适用场景

如果你在做 SaaS 后台、工作台、协作产品或管理端，并且反复需要处理“空状态、失败状态、权限限制、升级拦截、流程完成”这些界面，StateKit 就是为这类问题准备的。它的目标不是帮你画一个盒子，而是给你一套已经带有产品语气、结构和 CTA 的状态界面。

如果你需要的是完整设计系统、基础组件全集或高度自由的页面搭建能力，那 StateKit 不适合替代那一层。它故意收窄在状态界面这一层。

## 文档与参考

- 用 `npm run dev:docs` 查看本地 docs 站
- 用 `npm run dev:example` 查看集成示例
- 进入 [`docs/`](./docs) 查看产品规划、Block 规格、实现蓝图和 QA 说明
