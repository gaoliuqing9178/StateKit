/**
 * React 包对外暴露的 props 类型。
 * 它复用 shared 的跨框架 action / tone / layout 协议，同时用 ReactNode
 * 对应 Vue 里的 media/actions slot。
 */
import type { ReactNode } from "react";
import type {
  StateActionSlot,
  StateDensity,
  StateLayout,
  StateTone,
} from "@statekit-vue/shared";

export interface PresetStateBlockProps {
  /** 覆盖默认标题；不传时沿用组件或 preset 的默认值。 */
  title?: string;
  /** 覆盖默认描述；不传时沿用默认描述。 */
  description?: string;
  /** 覆盖默认 tone，用于切换视觉强调色。 */
  tone?: StateTone;
  /** 覆盖默认密度，影响间距和插画尺寸。 */
  density?: StateDensity;
  /** 覆盖默认布局；某些 preset 会校验该布局是否被支持。 */
  layout?: StateLayout;
  /** `undefined` 表示沿用默认按钮，`null` 表示显式移除主按钮。 */
  primaryAction?: StateActionSlot;
  /** `undefined` 表示沿用默认按钮，`null` 表示显式移除次按钮。 */
  secondaryAction?: StateActionSlot;
  /** 替换默认插图区域；传 `null` 可显式清空该区域内容。 */
  media?: ReactNode;
  /** 替换默认 CTA 区域；传 `null` 可显式清空该区域内容。 */
  actions?: ReactNode;
}
