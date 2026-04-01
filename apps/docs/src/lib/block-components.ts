/**
 * StateKit ?????
 * 1. block ??????
 * 2. ???????????????????? Vue ??????????????
 * 3. ?????????????????????????????????????
 */

import type { Component } from "vue";
import {
  EmptyCollectionState,
  EmptySearchState,
  FirstProjectState,
  LoadingTableState,
  LoadingWorkspaceState,
  LoadingImportState,
  InlineErrorState,
  PageErrorState,
  OfflineErrorState,
  NoPermissionState,
  RoleRestrictedState,
  SessionExpiredState,
  UpgradePlanState,
  TrialEndingState,
  UsageLimitState,
  TaskSuccessState,
  InviteSuccessState,
  PublishSuccessState,
} from "@statekit/vue";
export const blockComponentMap: Record<string, Component> = {
  EmptyCollectionState,
  EmptySearchState,
  FirstProjectState,
  LoadingTableState,
  LoadingWorkspaceState,
  LoadingImportState,
  InlineErrorState,
  PageErrorState,
  OfflineErrorState,
  NoPermissionState,
  RoleRestrictedState,
  SessionExpiredState,
  UpgradePlanState,
  TrialEndingState,
  UsageLimitState,
  TaskSuccessState,
  InviteSuccessState,
  PublishSuccessState,
};
