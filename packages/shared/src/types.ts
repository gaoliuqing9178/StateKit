export type StateTone = "neutral" | "brand" | "danger" | "warning" | "success";
export type StateDensity = "compact" | "cozy" | "spacious";
export type StateLayout = "inline" | "panel" | "page";
export type StateCategory = "empty" | "loading" | "error" | "permission" | "upgrade" | "success";

export type StateBlockId =
  | "empty-collection"
  | "empty-search"
  | "first-project"
  | "loading-table"
  | "loading-workspace"
  | "loading-import"
  | "inline-error"
  | "page-error"
  | "offline-error"
  | "no-permission"
  | "role-restricted"
  | "session-expired"
  | "upgrade-plan"
  | "trial-ending"
  | "usage-limit"
  | "task-success"
  | "invite-success"
  | "publish-success";

export type ImplementedBlockId = StateBlockId;

export type StateActionClickHandler = (event: MouseEvent) => void | Promise<void>;

export interface StateAction {
  label: string;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: StateActionClickHandler;
}

export type StateActionSlot = StateAction | null;

export interface BaseStateProps {
  title: string;
  description?: string;
  tone?: StateTone;
  density?: StateDensity;
  layout?: StateLayout;
  primaryAction?: StateActionSlot;
  secondaryAction?: StateActionSlot;
}

export interface StateBlockMeta {
  id: StateBlockId;
  slug: string;
  componentName: string;
  category: StateCategory;
  summary: string;
  priority: "launch" | "backlog";
  featured: boolean;
  supportedLayouts: StateLayout[];
  defaults: BaseStateProps;
}
