/**
 * `StatePresetBlock` 是旧场景包装组件共用的桥接层。
 * 它根据 `blockId` 从 shared 元数据里取出默认配置，再和调用方传入的覆盖 props 合并。
 */
import {
  stateBlockMetaById,
  type BaseStateProps,
  type StateBlockId,
} from "@statekit-vue/shared";
import { mergeStateProps } from "../lib/merge-state-props";
import type { PresetStateBlockProps } from "../types";
import { StateBlockShell } from "./StateBlockShell";

export interface StatePresetBlockProps extends PresetStateBlockProps {
  /** 指向某个预设元数据的稳定 id，是这个桥接层的唯一必填字段。 */
  blockId: StateBlockId;
}

export function StatePresetBlock({
  blockId,
  media,
  actions,
  ...props
}: StatePresetBlockProps) {
  const blockMeta = stateBlockMetaById[blockId];
  const requestedLayout = props.layout;
  const defaultLayout = blockMeta.defaults.layout ?? "panel";
  const resolvedLayout =
    !requestedLayout || blockMeta.supportedLayouts.includes(requestedLayout)
      ? requestedLayout ?? defaultLayout
      : defaultLayout;

  if (requestedLayout && resolvedLayout !== requestedLayout) {
    console.warn(
      `[StateKit] "${blockMeta.componentName}" does not support the "${requestedLayout}" layout. Falling back to "${defaultLayout}".`,
    );
  }

  const mergedProps: BaseStateProps = mergeStateProps(
    { ...props, layout: resolvedLayout },
    blockMeta.defaults,
  );

  return (
    <StateBlockShell
      {...mergedProps}
      category={blockMeta.category}
      media={media}
      actions={actions}
    />
  );
}
