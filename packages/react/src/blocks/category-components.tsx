import {
  stateBlockMetaById,
  type BaseStateProps,
  type StateCategory,
} from "@statekit-vue/shared";
import { StateBlockShell } from "../base/StateBlockShell";
import { mergeStateProps } from "../lib/merge-state-props";
import type { PresetStateBlockProps } from "../types";

function createCategoryState(
  category: StateCategory,
  defaultProps: BaseStateProps,
) {
  return function CategoryState({
    media,
    actions,
    ...props
  }: PresetStateBlockProps) {
    const mergedProps = mergeStateProps(props, defaultProps);

    return (
      <StateBlockShell
        {...mergedProps}
        category={category}
        media={media}
        actions={actions}
      />
    );
  };
}

const emptyDefaults: BaseStateProps = {
  title: "Nothing here yet",
  description:
    "Create your first item or change the current view to keep moving.",
  tone: "neutral",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Create item" },
  secondaryAction: { label: "Import" },
};

const loadingDefaults: BaseStateProps = {
  title: "Loading this view",
  description: "We are preparing the latest data and layout for this screen.",
  tone: "neutral",
  density: "cozy",
  layout: "panel",
};

const errorDefaults: BaseStateProps = {
  title: "Something went wrong",
  description:
    "Try again or return to a stable place while we recover this view.",
  tone: "danger",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Try again" },
  secondaryAction: { label: "Go back" },
};

const permissionDefaults: BaseStateProps = {
  title: "You do not have access",
  description: "Request access or return to a page you can use right now.",
  tone: "warning",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Request access" },
  secondaryAction: { label: "Go back" },
};

const upgradeDefaults: BaseStateProps = {
  title: "Upgrade to continue",
  description: "Move to a higher plan to unlock this workflow and higher limits.",
  tone: "brand",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Upgrade plan" },
  secondaryAction: { label: "Compare plans" },
};

const successDefaults: BaseStateProps = {
  title: "Done",
  description:
    "This step completed successfully. Review the result or continue to the next task.",
  tone: "success",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "View results" },
  secondaryAction: { label: "Continue" },
};

function DefaultOnboardingMedia() {
  return (
    <div
      className="sk-onboarding-media sk-onboarding-media--default"
      data-testid="onboarding-default-media"
    >
      <div className="sk-onboarding-media__header sk-onboarding-media__header--default">
        <div>
          <p className="sk-onboarding-media__eyebrow">Launch path</p>
          <strong className="sk-onboarding-media__title">
            Workspace activation plan
          </strong>
        </div>
      </div>

      <div className="sk-onboarding-media__window sk-onboarding-media__window--default">
        <div className="sk-onboarding-media__rail sk-onboarding-media__rail--default">
          <div className="sk-onboarding-media__rail-entry is-active">
            <span className="sk-onboarding-media__rail-dot" />
            <span className="sk-onboarding-media__rail-bar is-strong" />
          </div>
          <div className="sk-onboarding-media__rail-entry">
            <span className="sk-onboarding-media__rail-dot" />
            <span className="sk-onboarding-media__rail-bar" />
          </div>
          <div className="sk-onboarding-media__rail-entry">
            <span className="sk-onboarding-media__rail-dot" />
            <span className="sk-onboarding-media__rail-bar" />
          </div>
          <div className="sk-onboarding-media__rail-entry">
            <span className="sk-onboarding-media__rail-dot" />
            <span className="sk-onboarding-media__rail-bar" />
          </div>
        </div>

        <div className="sk-onboarding-media__canvas sk-onboarding-media__canvas--default">
          <div className="sk-onboarding-media__toolbar">
            <span className="is-active">Launch</span>
            <span>People</span>
            <span>Sync</span>
          </div>

          <div className="sk-onboarding-media__stats sk-onboarding-media__stats--default">
            <div className="sk-onboarding-media__stat">
              <small>Checklist</small>
              <strong>04</strong>
            </div>
            <div className="sk-onboarding-media__stat">
              <small>Progress</small>
              <strong>Guided</strong>
            </div>
          </div>

          <div className="sk-onboarding-media__feed sk-onboarding-media__feed--default">
            <div className="sk-onboarding-media__feed-item">
              <span />
              <span />
            </div>
            <div className="sk-onboarding-media__feed-item">
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EmptyState = createCategoryState("empty", emptyDefaults);
export const LoadingState = createCategoryState("loading", loadingDefaults);
export const ErrorState = createCategoryState("error", errorDefaults);
export const PermissionState = createCategoryState(
  "permission",
  permissionDefaults,
);
export const UpgradeState = createCategoryState("upgrade", upgradeDefaults);
export const SuccessState = createCategoryState("success", successDefaults);

export function OnboardingState({
  media,
  actions,
  ...props
}: PresetStateBlockProps) {
  const defaultProps: BaseStateProps = {
    ...stateBlockMetaById["onboarding-workspace"].defaults,
  };
  const mergedProps = mergeStateProps(props, defaultProps);
  const hasCustomMedia = media !== undefined;

  return (
    <StateBlockShell
      {...mergedProps}
      category="onboarding"
      media={hasCustomMedia ? media : <DefaultOnboardingMedia />}
      actions={actions}
    />
  );
}
