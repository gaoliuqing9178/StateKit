/**
 * React 包入口：
 * 1. 导出推荐的类别优先入口组件。
 * 2. 继续导出旧的场景化组件名，作为兼容层，方便存量项目平滑迁移。
 * 3. 样式在入口统一注入，因此大多数消费方只需要导入这个包即可拿到完整体验。
 */

import "./styles/index.css";

export { StateBlockShell } from "./base/StateBlockShell";
export type { StateBlockShellProps } from "./base/StateBlockShell";
export { StatePresetBlock } from "./base/StatePresetBlock";
export type { StatePresetBlockProps } from "./base/StatePresetBlock";
export {
  EmptyState,
  ErrorState,
  LoadingState,
  OnboardingState,
  PermissionState,
  SuccessState,
  UpgradeState,
} from "./blocks/category-components";
export {
  EmptyCollectionState,
  EmptySearchState,
  FirstProjectState,
  InlineErrorState,
  InviteSuccessState,
  LoadingImportState,
  LoadingTableState,
  LoadingWorkspaceState,
  NoPermissionState,
  OfflineErrorState,
  PageErrorState,
  PublishSuccessState,
  RoleRestrictedState,
  SessionExpiredState,
  TaskSuccessState,
  TrialEndingState,
  UpgradePlanState,
  UsageLimitState,
} from "./blocks/preset-components";
export type { PresetStateBlockProps } from "./types";
export * from "@statekit-vue/shared";
