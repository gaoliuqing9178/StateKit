import type { StateBlockId } from "@statekit-vue/shared";
import { StatePresetBlock } from "../base/StatePresetBlock";
import type { PresetStateBlockProps } from "../types";

function createPresetState(blockId: StateBlockId) {
  return function PresetState(props: PresetStateBlockProps) {
    return <StatePresetBlock blockId={blockId} {...props} />;
  };
}

export const EmptyCollectionState = createPresetState("empty-collection");
export const EmptySearchState = createPresetState("empty-search");
export const FirstProjectState = createPresetState("first-project");
export const LoadingTableState = createPresetState("loading-table");
export const LoadingWorkspaceState = createPresetState("loading-workspace");
export const LoadingImportState = createPresetState("loading-import");
export const InlineErrorState = createPresetState("inline-error");
export const PageErrorState = createPresetState("page-error");
export const OfflineErrorState = createPresetState("offline-error");
export const NoPermissionState = createPresetState("no-permission");
export const RoleRestrictedState = createPresetState("role-restricted");
export const SessionExpiredState = createPresetState("session-expired");
export const UpgradePlanState = createPresetState("upgrade-plan");
export const TrialEndingState = createPresetState("trial-ending");
export const UsageLimitState = createPresetState("usage-limit");
export const TaskSuccessState = createPresetState("task-success");
export const InviteSuccessState = createPresetState("invite-success");
export const PublishSuccessState = createPresetState("publish-success");
