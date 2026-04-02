# StateKit

面向 SaaS 产品的场景化状态 UI 组件库，基于 Vue 构建。

[English](./README.md)

StateKit 专注处理产品里那些高频出现、却最容易被临时拼凑的状态界面：empty、loading、error、permission、upgrade 和 success。它不是按钮、表单、弹窗这类通用 UI 组件库，而是专门解决“状态页与流程组件”这一层的问题。

## StateKit 覆盖什么

V1 目前提供 18 个预置 Block，覆盖 6 个类别：

- Empty states
- Loading states
- Error states
- Permission states
- Upgrade states
- Success states

严格意义上的 onboarding 类别目前还没有单独拆出来，现阶段通过 `FirstProjectState` 这类 first-run empty state 承接首次进入与初始化引导。

## 快速开始

```bash
npm install @statekit/vue
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import "@statekit/vue/styles.css";
import { EmptySearchState } from "@statekit/vue";

const clearing = ref(false);

async function handleClearFilters() {
  clearing.value = true;
  try {
    await Promise.resolve();
  } finally {
    clearing.value = false;
  }
}
</script>

<template>
  <EmptySearchState
    title="没有匹配的发票"
    description="可以更换关键词，或者先清除当前筛选条件。"
    :primary-action="{
      label: '清除筛选',
      onClick: handleClearFilters,
      loading: clearing,
      loadingLabel: '正在清除筛选...',
    }"
    :secondary-action="{
      label: '新建发票',
      href: '/invoices/new',
    }"
  />
</template>
```

## 统一的预置 API

所有预置 Block 共用同一套基础 props：

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

## CTA Action 对象

`primaryAction` 和 `secondaryAction` 都接收 `StateAction | null | undefined`。

`StateAction` 当前支持这些字段：

- `label`：必填，按钮文字
- `href`：可选，有值时渲染为链接
- `onClick`：可选，按钮或链接点击后的处理函数
- `loading`：可选，由业务侧控制的忙碌状态
- `loadingLabel`：可选，自定义 loading 文案，默认回退到 `Working...`
- `disabled`：可选，让动作保持可见但不可用

传参规则：

- 固定字符串和枚举值用普通属性，例如 `layout="panel"`、`tone="brand"`。
- 变量、对象、布尔值和 `null` 一律使用 `:` 绑定。
- 在 Vue 模板里，prop 名保持 kebab-case：`primaryAction` 要写成 `primary-action`，`secondaryAction` 要写成 `secondary-action`。
- action prop 保持 `undefined` 时，会继续使用预设默认按钮。
- 显式传 `null` 时，会移除预设按钮。
- CTA 的点击逻辑应放在 `primaryAction.onClick` 或 `secondaryAction.onClick` 里，不要绑在 block 根节点上。

## 文档与示例

- `npm run dev:docs` 可以打开本地 docs 站，查看 block 预览、安装说明和 example 路由。
- 每个 block 详情页现在都覆盖：
  - 如何改 `title` 和 `description`
  - 如何直接传值、从 `<script setup>` 变量传值、或通过 `v-bind` 传整对象
  - 如何配置 `primaryAction` 和 `secondaryAction`
  - 如何使用 `onClick`、`href`、`loading`、`loadingLabel`、`disabled` 和 `null`
- docs 里的 example 路由现在包括：
  - `Admin Empty States`
  - `Permissions And Upgrade`
  - `Task Flow`
- `npm run dev:example` 可以打开 `examples/vite-vue-admin` 里的外部管理后台集成示例。

## 仓库结构

```text
apps/docs
packages/shared
packages/vue
examples/vite-vue-admin
docs
```

- `apps/docs`：本地文档站，包含 block 预览、详细用法说明、安装文档和场景化 example 页面。
- `packages/shared`：共享类型、ID、元数据和优先级清单，是单一事实来源。
- `packages/vue`：Vue 预置组件和默认样式。
- `examples/vite-vue-admin`：使用当前 CTA action API 的管理后台风格集成示例。
- `docs`：项目内部的产品、实现、QA 和发布文档。

## 本地开发

在仓库根目录运行：

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

## 文档与发布说明

- 进入 [`docs/`](./docs) 查看内部规划和规格文档
- 进入 [`CHANGELOG.md`](./CHANGELOG.md) 查看版本化发布说明

## 适用边界

如果你在做 SaaS 后台、工作台、协作产品或管理端，并且反复要处理“空状态、失败状态、权限限制、升级拦截、流程完成”这些界面，StateKit 适合用来统一这些场景的文案、布局和 CTA 结构。

如果你需要的是完整设计系统、基础组件全集或高度自由的页面搭建能力，那 StateKit 不适合替代那一层。它刻意收窄在状态界面这一层。
