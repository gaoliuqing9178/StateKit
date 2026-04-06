/**
 * StateKit ?????
 * 1. block ??????
 * 2. ???????????????????? Vue ??????????????
 * 3. ?????????????????????????????????????
 */

import type { Component } from "vue";
import {
  EmptyState,
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
