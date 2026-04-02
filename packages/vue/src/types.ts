import type {
  StateActionSlot,
  StateDensity,
  StateLayout,
  StateTone,
} from "@statekit/shared";

export interface PresetStateBlockProps {
  title?: string;
  description?: string;
  tone?: StateTone;
  density?: StateDensity;
  layout?: StateLayout;
  primaryAction?: StateActionSlot;
  secondaryAction?: StateActionSlot;
}
