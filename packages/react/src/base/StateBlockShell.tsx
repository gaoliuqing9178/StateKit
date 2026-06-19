/**
 * `StateBlockShell` 是 React 包里真正负责渲染 UI 的统一壳组件。
 * 七个类别入口组件和所有旧场景包装组件，最终都会收敛到这里。
 */
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import type {
  BaseStateProps,
  StateAction,
  StateCategory,
  StateDensity,
  StateLayout,
  StateTone,
} from "@statekit-vue/shared";

export interface StateBlockShellProps extends BaseStateProps {
  /** 用于切换默认插画、背景风格以及顶部 kicker 文案。 */
  category?: StateCategory;
  /** 替换默认插图区域；对应 Vue 包的 `#media` slot。 */
  media?: ReactNode;
  /** 替换默认 CTA 区域；对应 Vue 包的 `#actions` slot。 */
  actions?: ReactNode;
}

interface RenderedAction {
  /** 用于 React list 的稳定 key。 */
  key: string;
  /** 保留原始 action，点击时仍然回调调用方传入的处理器。 */
  source: StateAction;
  /** 根据是否传入 href 决定渲染为链接还是按钮。 */
  component: "a" | "button";
  /** 仅在可用状态下保留 href，避免禁用中的链接仍然可跳转。 */
  href?: string;
  /** 最终显示在按钮上的文案，loading 时会替换。 */
  label: string;
  /** 第二个动作会被标记成次按钮，方便样式区分。 */
  isSecondary: boolean;
  /** 业务层显式传入的禁用态。 */
  isDisabled: boolean;
  /** 统一的“当前不可交互”标记，包含 disabled 和 loading。 */
  isUnavailable: boolean;
  /** 当前是否处于加载中。 */
  isLoading: boolean;
  /** 禁用链接时把它移出 Tab 顺序，避免键盘还能聚焦到不可用项。 */
  tabIndex?: number;
}

const defaultTone: StateTone = "neutral";
const defaultDensity: StateDensity = "cozy";
const defaultLayout: StateLayout = "panel";
const defaultCategory: StateCategory = "empty";

function getRenderedActions(
  primaryAction: BaseStateProps["primaryAction"],
  secondaryAction: BaseStateProps["secondaryAction"],
): RenderedAction[] {
  return [primaryAction, secondaryAction]
    .filter((action): action is StateAction => action != null)
    .map((action, index) => {
      const isDisabled = Boolean(action.disabled);
      const isLoading = Boolean(action.loading);
      const isUnavailable = isDisabled || isLoading;

      return {
        key: `${index}-${action.label}`,
        source: action,
        component: action.href ? "a" : "button",
        href: isUnavailable ? undefined : action.href,
        label: action.loading ? action.loadingLabel ?? "Working..." : action.label,
        isSecondary: index > 0,
        isDisabled,
        isUnavailable,
        isLoading,
        tabIndex: action.href && isUnavailable ? -1 : undefined,
      };
    });
}

function getActionClassName(action: RenderedAction) {
  return [
    "sk-shell__action",
    action.isSecondary ? "is-secondary" : "",
    action.isDisabled ? "is-disabled" : "",
    action.isLoading ? "is-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function handleActionClick(
  action: RenderedAction,
  event: ReactMouseEvent<HTMLAnchorElement | HTMLButtonElement>,
) {
  if (action.isUnavailable) {
    event.preventDefault();
    return;
  }

  action.source.onClick?.(event.nativeEvent);
}

function DefaultFigure({ category }: { category: StateCategory }) {
  if (category === "onboarding") {
    return (
      <div className="sk-figure sk-figure--onboarding">
        <span className="sk-figure__panel" />
        <span className="sk-figure__panel is-back" />
        <span className="sk-figure__path" />
        <span className="sk-figure__path-dot" />
        <span className="sk-figure__path-dot is-target" />
      </div>
    );
  }

  if (category === "loading") {
    return (
      <div className="sk-figure sk-figure--loading">
        <span className="sk-figure__ring" />
      </div>
    );
  }

  if (category === "error") {
    return (
      <div className="sk-figure sk-figure--error">
        <span className="sk-figure__badge" />
        <span className="sk-figure__cross" />
        <span className="sk-figure__cross is-secondary" />
        <span className="sk-figure__shadow-line" />
      </div>
    );
  }

  if (category === "permission") {
    return (
      <div className="sk-figure sk-figure--permission">
        <span className="sk-figure__panel" />
        <span className="sk-figure__panel is-back" />
        <span className="sk-figure__lock-body" />
        <span className="sk-figure__lock-arch" />
      </div>
    );
  }

  if (category === "upgrade") {
    return (
      <div className="sk-figure sk-figure--upgrade">
        <span className="sk-figure__panel" />
        <span className="sk-figure__panel is-back" />
        <span className="sk-figure__spark" />
        <span className="sk-figure__spark is-secondary" />
      </div>
    );
  }

  if (category === "success") {
    return (
      <div className="sk-figure sk-figure--success">
        <span className="sk-figure__badge" />
        <span className="sk-figure__check" />
        <span className="sk-figure__check is-secondary" />
      </div>
    );
  }

  return (
    <div className="sk-figure sk-figure--empty">
      <span className="sk-figure__panel" />
      <span className="sk-figure__panel is-back" />
    </div>
  );
}

export function StateBlockShell({
  title,
  description,
  tone = defaultTone,
  density = defaultDensity,
  layout = defaultLayout,
  category = defaultCategory,
  primaryAction,
  secondaryAction,
  media,
  actions,
}: StateBlockShellProps) {
  const renderedActions = getRenderedActions(primaryAction, secondaryAction);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const hasCustomMedia = media !== undefined;
  const hasCustomActions = actions !== undefined;

  return (
    <section
      className="sk-shell"
      data-category={category}
      data-density={density}
      data-layout={layout}
      data-tone={tone}
    >
      <div className="sk-shell__inner">
        <div className="sk-shell__media" aria-hidden={hasCustomMedia ? undefined : true}>
          <div className="sk-shell__media-frame">
            {hasCustomMedia ? media : <DefaultFigure category={category} />}
          </div>
        </div>

        <div className="sk-shell__content">
          <p className="sk-shell__kicker">{categoryLabel}</p>
          <h2 className="sk-shell__title">{title}</h2>
          {description ? (
            <p className="sk-shell__description">{description}</p>
          ) : null}

          {hasCustomActions || renderedActions.length > 0 ? (
            <div className="sk-shell__actions">
              {hasCustomActions
                ? actions
                : renderedActions.map((action) =>
                    action.component === "a" ? (
                      <a
                        key={action.key}
                        className={getActionClassName(action)}
                        aria-busy={action.isLoading ? "true" : undefined}
                        aria-disabled={action.isUnavailable ? "true" : undefined}
                        href={action.href}
                        tabIndex={action.tabIndex}
                        onClick={(event) => handleActionClick(action, event)}
                      >
                        {action.label}
                      </a>
                    ) : (
                      <button
                        key={action.key}
                        className={getActionClassName(action)}
                        aria-busy={action.isLoading ? "true" : undefined}
                        aria-disabled={action.isUnavailable ? "true" : undefined}
                        disabled={action.isUnavailable}
                        type="button"
                        onClick={(event) => handleActionClick(action, event)}
                      >
                        {action.label}
                      </button>
                    ),
                  )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
