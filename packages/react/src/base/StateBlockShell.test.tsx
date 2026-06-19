import { afterEach, describe, expect, it, vi } from "vitest";
import { StateBlockShell } from "./StateBlockShell";
import { cleanupReact, clickElement, renderReact } from "../test-utils";

describe("React StateBlockShell", () => {
  afterEach(() => {
    cleanupReact();
    vi.restoreAllMocks();
  });

  it("renders actions as button or link based on href", () => {
    const view = renderReact(
      <StateBlockShell
        title="Set up workspace"
        primaryAction={{ label: "Start setup" }}
        secondaryAction={{ label: "Read guide", href: "/docs/installation" }}
      />,
    );

    const actions = view.getAllBySelector(".sk-shell__action");

    expect(actions).toHaveLength(2);
    expect(actions[0].tagName).toBe("BUTTON");
    expect(actions[0].getAttribute("type")).toBe("button");
    expect(actions[1].tagName).toBe("A");
    expect(actions[1].getAttribute("href")).toBe("/docs/installation");
  });

  it("keeps the default onboarding figure decorative when no custom media is provided", () => {
    const view = renderReact(
      <StateBlockShell title="Welcome" category="onboarding" />,
    );

    expect(view.getBySelector(".sk-shell__media").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("exposes custom media to assistive tech instead of hiding the whole media region", () => {
    const view = renderReact(
      <StateBlockShell
        title="Welcome"
        category="onboarding"
        media={<div data-testid="hero-media">Interactive launch preview</div>}
      />,
    );

    expect(view.getBySelector('[data-testid="hero-media"]').textContent).toBe(
      "Interactive launch preview",
    );
    expect(
      view.getBySelector(".sk-shell__media").getAttribute("aria-hidden"),
    ).toBeNull();
  });

  it("blocks unavailable button actions and exposes loading semantics", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    const view = renderReact(
      <StateBlockShell
        title="Preparing workspace"
        primaryAction={{
          label: "Start setup",
          loading: true,
          loadingLabel: "Preparing workspace...",
          onClick,
        }}
      />,
    );

    const action = view.getBySelector(".sk-shell__action");

    expect(action.textContent).toBe("Preparing workspace...");
    expect(action.getAttribute("aria-busy")).toBe("true");
    expect(action.getAttribute("aria-disabled")).toBe("true");
    expect(action.hasAttribute("disabled")).toBe(true);

    clickElement(action);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("falls back to the default loading label when none is provided", () => {
    const view = renderReact(
      <StateBlockShell
        title="Sync data"
        primaryAction={{
          label: "Retry",
          loading: true,
        }}
      />,
    );

    expect(view.getBySelector(".sk-shell__action").textContent).toBe("Working...");
  });

  it("removes href and tab focus from unavailable links", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    const view = renderReact(
      <StateBlockShell
        title="Upgrade plan"
        primaryAction={{
          label: "Compare plans",
          href: "/pricing",
          disabled: true,
          onClick,
        }}
      />,
    );

    const action = view.getBySelector(".sk-shell__action");

    expect(action.tagName).toBe("A");
    expect(action.getAttribute("href")).toBeNull();
    expect(action.getAttribute("tabindex")).toBe("-1");
    expect(action.getAttribute("aria-disabled")).toBe("true");

    clickElement(action);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("invokes click handlers for available actions with the native mouse event", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    const view = renderReact(
      <StateBlockShell
        title="Invite teammates"
        primaryAction={{
          label: "Invite now",
          onClick,
        }}
      />,
    );

    clickElement(view.getBySelector(".sk-shell__action"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it("lets custom actions replace the fallback CTA rendering", () => {
    const view = renderReact(
      <StateBlockShell
        title="Launch onboarding"
        primaryAction={{ label: "Default start" }}
        secondaryAction={{ label: "Default guide" }}
        actions={
          <div data-testid="custom-actions">
            <button type="button">Launch now</button>
            <button type="button">Skip for now</button>
          </div>
        }
      />,
    );

    const customActions = view.getBySelector('[data-testid="custom-actions"]');

    expect(customActions.textContent).toContain("Launch now");
    expect(customActions.textContent).toContain("Skip for now");
    expect(view.container.textContent).not.toContain("Default start");
    expect(view.container.textContent).not.toContain("Default guide");
  });
});
