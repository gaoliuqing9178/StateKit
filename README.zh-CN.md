# StateKit

基于 Vue 构建、面向 SaaS 产品的按类别统一状态 UI 组件库。

[English](./README.md)

StateKit 专注处理产品里那些高频出现、却最容易被临时拼凑的状态界面：empty、loading、error、permission、upgrade 和 success。它不是按钮库、表单库，也不是完整设计系统，而是专门解决“状态页与流程节点”这一层的问题。

## 在线文档

- 在线 docs：https://state-kit-vue-docs.vercel.app/
- 推荐从 `/recipes` 开始浏览预设 recipes，从 `/docs/installation` 查看安装说明。
- 旧的 `/blocks` 路由会自动跳转到 `/recipes`，方便兼容历史链接。

## StateKit 提供什么

当前对外公开的主入口是 6 个按类别统一的组件：

- `EmptyState`
- `LoadingState`
- `ErrorState`
- `PermissionState`
- `UpgradeState`
- `SuccessState`

这 6 个公开入口由 18 个预置 recipe 提供默认配置。旧的场景名导出，例如 `EmptySearchState`、`OfflineErrorState` 等，仍然保留为兼容层，但已经属于 deprecated compatibility exports，建议新代码优先使用统一类别入口。

严格意义上的 onboarding 类别目前没有单独拆出，现阶段仍通过 `FirstProjectState` 这类 first-run empty recipe 承接首次进入与初始化引导。

## 快速开始

```bash
npm install @statekit-vue/vue
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import "@statekit-vue/vue/styles.css";
import { EmptyState } from "@statekit-vue/vue";

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
  <EmptyState
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

## 统一 Props API

所有公开类别入口和底层 recipe 共用同一套基础 props：

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

`primaryAction` 和 `secondaryAction` 都接受 `StateAction | null | undefined`。

`StateAction` 当前支持这些字段：

- `label`：必填，按钮文案
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
- CTA 的点击逻辑应放在 `primaryAction.onClick` 或 `secondaryAction.onClick` 里，不要绑在组件根节点上。

## 文档与示例

- 在线 docs：https://state-kit-vue-docs.vercel.app/
- `npm run dev:docs` 可以打开本地 docs 站，查看 recipe 预览、安装说明和示例路由。
- docs 站当前以 `/recipes` 作为主要路由前缀，同时保留 `/blocks` 到新地址的跳转兼容。
- 每个 recipe 详情页现在都会说明：
  - 如何改 `title` 和 `description`
  - 如何直接传值、从 `<script setup>` 传值，或通过 `v-bind` 传整对象
  - 如何配置 `primaryAction` 和 `secondaryAction`
  - 如何使用 `onClick`、`href`、`loading`、`loadingLabel`、`disabled` 和 `null`
- docs 里的 example 路由当前包括：
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

- `apps/docs`：本地文档站，包含 recipe 预览、详细用法说明、安装文档和工作流示例
- `packages/shared`：共享类型、ID、元数据和优先级清单，是单一事实来源
- `packages/vue`：Vue 组件、兼容导出层和默认样式
- `examples/vite-vue-admin`：使用当前 action API 的后台风格集成示例
- `docs`：项目内部的产品、实现、QA 和发布文档

## 本地开发

在仓库根目录运行：

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

发版前建议额外执行：

```bash
npm run pack:check
npm run smoke:install
```

## 文档与发布说明

- 进入 [`docs/`](./docs) 查看内部规划与规范文档
- 进入 [`CHANGELOG.md`](./CHANGELOG.md) 查看版本化发布说明

## 适用边界

如果你在做 SaaS 后台、工作台、协作产品或管理端，并且反复需要处理空状态、失败状态、权限限制、升级拦截和流程完成这类界面，StateKit 适合用来统一这些场景的文案、布局和 CTA 结构。

如果你需要的是完整设计系统、基础组件全集或高度自由的页面搭建能力，那 StateKit 不适合替代那一层。它刻意收窄在状态界面这一层。
