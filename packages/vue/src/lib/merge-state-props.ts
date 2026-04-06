import { computed } from "vue";
import type { BaseStateProps } from "@statekit-vue/shared";
import type { PresetStateBlockProps } from "../types";

export function useMergedStateProps(
  props: PresetStateBlockProps,
  defaultProps: BaseStateProps,
) {
  return computed<BaseStateProps>(() => ({
    ...defaultProps,
    title: props.title ?? defaultProps.title,
    description: props.description ?? defaultProps.description,
    tone: props.tone ?? defaultProps.tone,
    density: props.density ?? defaultProps.density,
    layout: props.layout ?? defaultProps.layout,
    primaryAction:
      props.primaryAction === undefined
        ? defaultProps.primaryAction
        : props.primaryAction,
    secondaryAction:
      props.secondaryAction === undefined
        ? defaultProps.secondaryAction
        : props.secondaryAction,
  }));
}
