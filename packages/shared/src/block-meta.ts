/**
 * StateKit ?????
 * 1. ?? block ???????
 * 2. ??????????? block ???????????????????????
 * 3. ??????????????????????????
 */

import type {
  ImplementedBlockId,
  StateBlockId,
  StateBlockMeta,
  StateLayout,
} from "./types";
const allLayouts: StateLayout[] = ["inline", "panel", "page"];
const panelAndPage: StateLayout[] = ["panel", "page"];
const inlineAndPanel: StateLayout[] = ["inline", "panel"];
export const stateBlockMetaList: StateBlockMeta[] = [
  {
    id: "empty-collection",
    slug: "empty-collection-state",
    componentName: "EmptyState",
    category: "empty",
    summary: "Use when a collection has not been started yet.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "No items yet",
      description: "Create your first item to start filling this collection.",
      tone: "neutral",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Create item" },
      secondaryAction: { label: "Import" },
    },
  },
  {
    id: "empty-search",
    slug: "empty-search-state",
    componentName: "EmptyState",
    category: "empty",
    summary: "Use when search or filters return zero results.",
    priority: "launch",
    featured: true,
    supportedLayouts: allLayouts,
    defaults: {
      title: "No results found",
      description: "Try a different keyword or clear your filters.",
      tone: "neutral",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Clear filters" },
      secondaryAction: { label: "Create item" },
    },
  },
  {
    id: "first-project",
    slug: "first-project-state",
    componentName: "EmptyState",
    category: "empty",
    summary: "Use as an onboarding-ready first-run state for a workspace.",
    priority: "launch",
    featured: true,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Create your first project",
      description:
        "Start with a project space to organize files, teammates, and tasks.",
      tone: "brand",
      density: "spacious",
      layout: "page",
      primaryAction: { label: "Create project" },
      secondaryAction: { label: "View example" },
    },
  },
  {
    id: "loading-table",
    slug: "loading-table-state",
    componentName: "LoadingState",
    category: "loading",
    summary:
      "Use when table rows are loading and structure should stay visible.",
    priority: "backlog",
    featured: false,
    supportedLayouts: inlineAndPanel,
    defaults: {
      title: "Loading records",
      description: "Fetching the latest records for this view.",
      tone: "neutral",
      density: "compact",
      layout: "inline",
    },
  },
  {
    id: "loading-workspace",
    slug: "loading-workspace-state",
    componentName: "LoadingState",
    category: "loading",
    summary: "Use while preparing a workspace or editor surface.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Preparing your workspace",
      description:
        "We are setting up the structure so you can get back to work.",
      tone: "neutral",
      density: "spacious",
      layout: "page",
    },
  },
  {
    id: "loading-import",
    slug: "loading-import-state",
    componentName: "LoadingState",
    category: "loading",
    summary: "Use during import, sync, or bulk-processing tasks.",
    priority: "backlog",
    featured: false,
    supportedLayouts: allLayouts,
    defaults: {
      title: "Import in progress",
      description:
        "Large uploads can take a moment. You can keep working while we process this task.",
      tone: "brand",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "View tasks" },
    },
  },
  {
    id: "inline-error",
    slug: "inline-error-state",
    componentName: "ErrorState",
    category: "error",
    summary: "Use for localized failures inside a table, list, or panel.",
    priority: "backlog",
    featured: false,
    supportedLayouts: inlineAndPanel,
    defaults: {
      title: "Something went wrong",
      description:
        "Try loading this section again or contact support if the issue keeps happening.",
      tone: "danger",
      density: "compact",
      layout: "inline",
      primaryAction: { label: "Try again" },
      secondaryAction: { label: "Contact support" },
    },
  },
  {
    id: "page-error",
    slug: "page-error-state",
    componentName: "ErrorState",
    category: "error",
    summary: "Use when a full page fails to load essential data.",
    priority: "launch",
    featured: true,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "We could not load this page",
      description:
        "The data needed for this view is unavailable right now. Reload or go back to a safe place.",
      tone: "danger",
      density: "spacious",
      layout: "page",
      primaryAction: { label: "Reload" },
      secondaryAction: { label: "Go back" },
    },
  },
  {
    id: "offline-error",
    slug: "offline-error-state",
    componentName: "ErrorState",
    category: "error",
    summary:
      "Use when the user is offline or the network connection is interrupted.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "You are offline",
      description:
        "Check your connection and try again once you are back online.",
      tone: "danger",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Try again" },
    },
  },
  {
    id: "no-permission",
    slug: "no-permission-state",
    componentName: "PermissionState",
    category: "permission",
    summary:
      "Use when a page or resource is not accessible to the current user.",
    priority: "launch",
    featured: true,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "You do not have access",
      description:
        "Ask an administrator for access to this workspace or return to a page you can use.",
      tone: "warning",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Request access" },
      secondaryAction: { label: "Go back" },
    },
  },
  {
    id: "role-restricted",
    slug: "role-restricted-state",
    componentName: "PermissionState",
    category: "permission",
    summary: "Use when a user can view the page but cannot perform the action.",
    priority: "backlog",
    featured: false,
    supportedLayouts: inlineAndPanel,
    defaults: {
      title: "Your role cannot perform this action",
      description:
        "You can view this information, but an administrator must complete this step.",
      tone: "warning",
      density: "compact",
      layout: "inline",
      primaryAction: { label: "Contact admin" },
    },
  },
  {
    id: "session-expired",
    slug: "session-expired-state",
    componentName: "PermissionState",
    category: "permission",
    summary:
      "Use when the user session has expired and re-authentication is required.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Your session has expired",
      description: "Sign in again to continue where you left off.",
      tone: "warning",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Sign in again" },
    },
  },
  {
    id: "upgrade-plan",
    slug: "upgrade-plan-state",
    componentName: "UpgradeState",
    category: "upgrade",
    summary: "Use when a feature is gated by plan or subscription tier.",
    priority: "launch",
    featured: true,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Upgrade to unlock this feature",
      description:
        "Move to a higher plan to access advanced workflows, higher limits, and collaboration controls.",
      tone: "brand",
      density: "spacious",
      layout: "page",
      primaryAction: { label: "Upgrade plan" },
      secondaryAction: { label: "Compare plans" },
    },
  },
  {
    id: "trial-ending",
    slug: "trial-ending-state",
    componentName: "UpgradeState",
    category: "upgrade",
    summary: "Use when a free trial is close to its expiration date.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Your trial ends soon",
      description:
        "Choose a plan now to keep your projects, teammates, and automation running without interruption.",
      tone: "warning",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Choose a plan" },
      secondaryAction: { label: "Talk to sales" },
    },
  },
  {
    id: "usage-limit",
    slug: "usage-limit-state",
    componentName: "UpgradeState",
    category: "upgrade",
    summary: "Use when a team has reached a quota or plan limit.",
    priority: "backlog",
    featured: false,
    supportedLayouts: allLayouts,
    defaults: {
      title: "You have reached your limit",
      description:
        "Increase your limit or review usage to keep work moving without interruptions.",
      tone: "warning",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Increase limit" },
      secondaryAction: { label: "View usage" },
    },
  },
  {
    id: "task-success",
    slug: "task-success-state",
    componentName: "SuccessState",
    category: "success",
    summary:
      "Use when an import, export, or background task completes successfully.",
    priority: "launch",
    featured: true,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Task completed",
      description:
        "Your task finished successfully. Review the results or start the next one.",
      tone: "success",
      density: "spacious",
      layout: "page",
      primaryAction: { label: "View results" },
      secondaryAction: { label: "Start another" },
    },
  },
  {
    id: "invite-success",
    slug: "invite-success-state",
    componentName: "SuccessState",
    category: "success",
    summary: "Use when team invitations have been sent.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Invitations sent",
      description:
        "Your teammates will receive an email shortly. Keep organizing your workspace while they join.",
      tone: "success",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "Manage members" },
      secondaryAction: { label: "Invite more" },
    },
  },
  {
    id: "publish-success",
    slug: "publish-success-state",
    componentName: "SuccessState",
    category: "success",
    summary:
      "Use when content, configuration, or a page is published successfully.",
    priority: "backlog",
    featured: false,
    supportedLayouts: panelAndPage,
    defaults: {
      title: "Published successfully",
      description:
        "Your changes are live. Review the published page or head back to the dashboard.",
      tone: "success",
      density: "cozy",
      layout: "panel",
      primaryAction: { label: "View live page" },
      secondaryAction: { label: "Back to dashboard" },
    },
  },
];
export const priorityStateBlockIds = [
  "empty-search",
  "no-permission",
  "upgrade-plan",
  "page-error",
  "task-success",
  "first-project",
] as const satisfies readonly ImplementedBlockId[];
export const implementedBlockIds = [
  "empty-collection",
  "empty-search",
  "first-project",
  "loading-table",
  "loading-workspace",
  "loading-import",
  "inline-error",
  "page-error",
  "offline-error",
  "no-permission",
  "role-restricted",
  "session-expired",
  "upgrade-plan",
  "trial-ending",
  "usage-limit",
  "task-success",
  "invite-success",
  "publish-success",
] as const satisfies readonly ImplementedBlockId[];
export const stateBlockMetaById = Object.fromEntries(
  stateBlockMetaList.map((meta) => [meta.id, meta]),
) as Record<StateBlockId, StateBlockMeta>;
export const stateBlockMetaBySlug = Object.fromEntries(
  stateBlockMetaList.map((meta) => [meta.slug, meta]),
) as Record<string, StateBlockMeta>;
export const priorityStateBlocks = priorityStateBlockIds.map(
  (id) => stateBlockMetaById[id],
);
const implementedBlockSet = new Set<string>(implementedBlockIds);
export function isImplementedBlockId(
  value: string,
): value is ImplementedBlockId {
  return implementedBlockSet.has(value);
}
