/**
 * StateKit ?????
 * 1. Vue ??????
 * 2. ???????????????? block ?????????????
 * 3. ?????????????? API ?????????????????????
 */

import "./styles/index.css";
import StateBlockShellComponent from "./base/StateBlockShell.vue";
import EmptyStateComponent from "./blocks/empty/EmptyState.vue";
import EmptyCollectionStateComponent from "./blocks/empty/EmptyCollectionState.vue";
import EmptySearchStateComponent from "./blocks/empty/EmptySearchState.vue";
import FirstProjectStateComponent from "./blocks/empty/FirstProjectState.vue";
import LoadingStateComponent from "./blocks/loading/LoadingState.vue";
import LoadingTableStateComponent from "./blocks/loading/LoadingTableState.vue";
import LoadingWorkspaceStateComponent from "./blocks/loading/LoadingWorkspaceState.vue";
import LoadingImportStateComponent from "./blocks/loading/LoadingImportState.vue";
import ErrorStateComponent from "./blocks/error/ErrorState.vue";
import InlineErrorStateComponent from "./blocks/error/InlineErrorState.vue";
import PageErrorStateComponent from "./blocks/error/PageErrorState.vue";
import OfflineErrorStateComponent from "./blocks/error/OfflineErrorState.vue";
import PermissionStateComponent from "./blocks/permission/PermissionState.vue";
import NoPermissionStateComponent from "./blocks/permission/NoPermissionState.vue";
import RoleRestrictedStateComponent from "./blocks/permission/RoleRestrictedState.vue";
import SessionExpiredStateComponent from "./blocks/permission/SessionExpiredState.vue";
import UpgradeStateComponent from "./blocks/upgrade/UpgradeState.vue";
import UpgradePlanStateComponent from "./blocks/upgrade/UpgradePlanState.vue";
import TrialEndingStateComponent from "./blocks/upgrade/TrialEndingState.vue";
import UsageLimitStateComponent from "./blocks/upgrade/UsageLimitState.vue";
import SuccessStateComponent from "./blocks/success/SuccessState.vue";
import TaskSuccessStateComponent from "./blocks/success/TaskSuccessState.vue";
import InviteSuccessStateComponent from "./blocks/success/InviteSuccessState.vue";
import PublishSuccessStateComponent from "./blocks/success/PublishSuccessState.vue";

export const StateBlockShell: typeof StateBlockShellComponent =
  StateBlockShellComponent;
export const EmptyState: typeof EmptyStateComponent = EmptyStateComponent;
export const LoadingState: typeof LoadingStateComponent = LoadingStateComponent;
export const ErrorState: typeof ErrorStateComponent = ErrorStateComponent;
export const PermissionState: typeof PermissionStateComponent =
  PermissionStateComponent;
export const UpgradeState: typeof UpgradeStateComponent = UpgradeStateComponent;
export const SuccessState: typeof SuccessStateComponent = SuccessStateComponent;

/**
 * @deprecated Use `EmptyState` and customize content, layout, and actions instead.
 */
export const EmptyCollectionState: typeof EmptyCollectionStateComponent =
  EmptyCollectionStateComponent;
/**
 * @deprecated Use `EmptyState` and customize content, layout, and actions instead.
 */
export const EmptySearchState: typeof EmptySearchStateComponent =
  EmptySearchStateComponent;
/**
 * @deprecated Use `EmptyState` and customize content, layout, and actions instead.
 */
export const FirstProjectState: typeof FirstProjectStateComponent =
  FirstProjectStateComponent;
/**
 * @deprecated Use `LoadingState` and customize content, layout, and actions instead.
 */
export const LoadingTableState: typeof LoadingTableStateComponent =
  LoadingTableStateComponent;
/**
 * @deprecated Use `LoadingState` and customize content, layout, and actions instead.
 */
export const LoadingWorkspaceState: typeof LoadingWorkspaceStateComponent =
  LoadingWorkspaceStateComponent;
/**
 * @deprecated Use `LoadingState` and customize content, layout, and actions instead.
 */
export const LoadingImportState: typeof LoadingImportStateComponent =
  LoadingImportStateComponent;
/**
 * @deprecated Use `ErrorState` and customize content, layout, and actions instead.
 */
export const InlineErrorState: typeof InlineErrorStateComponent =
  InlineErrorStateComponent;
/**
 * @deprecated Use `ErrorState` and customize content, layout, and actions instead.
 */
export const PageErrorState: typeof PageErrorStateComponent =
  PageErrorStateComponent;
/**
 * @deprecated Use `ErrorState` and customize content, layout, and actions instead.
 */
export const OfflineErrorState: typeof OfflineErrorStateComponent =
  OfflineErrorStateComponent;
/**
 * @deprecated Use `PermissionState` and customize content, layout, and actions instead.
 */
export const NoPermissionState: typeof NoPermissionStateComponent =
  NoPermissionStateComponent;
/**
 * @deprecated Use `PermissionState` and customize content, layout, and actions instead.
 */
export const RoleRestrictedState: typeof RoleRestrictedStateComponent =
  RoleRestrictedStateComponent;
/**
 * @deprecated Use `PermissionState` and customize content, layout, and actions instead.
 */
export const SessionExpiredState: typeof SessionExpiredStateComponent =
  SessionExpiredStateComponent;
/**
 * @deprecated Use `UpgradeState` and customize content, layout, and actions instead.
 */
export const UpgradePlanState: typeof UpgradePlanStateComponent =
  UpgradePlanStateComponent;
/**
 * @deprecated Use `UpgradeState` and customize content, layout, and actions instead.
 */
export const TrialEndingState: typeof TrialEndingStateComponent =
  TrialEndingStateComponent;
/**
 * @deprecated Use `UpgradeState` and customize content, layout, and actions instead.
 */
export const UsageLimitState: typeof UsageLimitStateComponent =
  UsageLimitStateComponent;
/**
 * @deprecated Use `SuccessState` and customize content, layout, and actions instead.
 */
export const TaskSuccessState: typeof TaskSuccessStateComponent =
  TaskSuccessStateComponent;
/**
 * @deprecated Use `SuccessState` and customize content, layout, and actions instead.
 */
export const InviteSuccessState: typeof InviteSuccessStateComponent =
  InviteSuccessStateComponent;
/**
 * @deprecated Use `SuccessState` and customize content, layout, and actions instead.
 */
export const PublishSuccessState: typeof PublishSuccessStateComponent =
  PublishSuccessStateComponent;

export type { PresetStateBlockProps } from "./types";
export * from "@statekit-vue/shared";
