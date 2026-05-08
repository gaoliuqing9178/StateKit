/**
 * StateKit docs recipe 组件映射表
 * 1. 作用：把 recipe slug 或旧组件名映射到当前推荐的 category-first Vue 组件
 * 2. docs 站用这张表动态渲染 recipe 展示区，不需要为每个 recipe 单独写 import 逻辑
 * 3. 维护要点：新增 recipe 时先更新 shared 元数据，再在这里补一条映射；旧名称映射到对应 category 入口即可
 */

import type { Component } from "vue";
import {
  EmptyState,
  OnboardingState,
  LoadingState,
  ErrorState,
  PermissionState,
  UpgradeState,
  SuccessState,
} from "@statekit-vue/vue";
export const recipeComponentMap: Record<string, Component> = {
  EmptyState,
  EmptyCollectionState: EmptyState,
  EmptySearchState: EmptyState,
  FirstProjectState: EmptyState,
  OnboardingState,
  LoadingState,
  LoadingTableState: LoadingState,
  LoadingWorkspaceState: LoadingState,
  LoadingImportState: LoadingState,
  ErrorState,
  InlineErrorState: ErrorState,
  PageErrorState: ErrorState,
  OfflineErrorState: ErrorState,
  PermissionState,
  NoPermissionState: PermissionState,
  RoleRestrictedState: PermissionState,
  SessionExpiredState: PermissionState,
  UpgradeState,
  UpgradePlanState: UpgradeState,
  TrialEndingState: UpgradeState,
  UsageLimitState: UpgradeState,
  SuccessState,
  TaskSuccessState: SuccessState,
  InviteSuccessState: SuccessState,
  PublishSuccessState: SuccessState,
};
