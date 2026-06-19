/**
 * 把调用方传入的覆盖 props 与组件默认值合并成统一可渲染的结构。
 *
 * 这里保留 Vue 包相同的语义：
 * - `undefined` 代表“调用方没有干预”，应继续沿用默认值；
 * - `null` 只对 action 生效，代表“调用方明确要求把这个按钮移除”。
 */
import type { BaseStateProps } from "@statekit-vue/shared";
import type { PresetStateBlockProps } from "../types";

export function mergeStateProps(
  props: PresetStateBlockProps,
  defaultProps: BaseStateProps,
): BaseStateProps {
  return {
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
  };
}
