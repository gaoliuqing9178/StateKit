import { afterEach, describe, expect, it, vi } from "vitest";
import { StatePresetBlock } from "./StatePresetBlock";
import { cleanupReact, renderReact } from "../test-utils";

describe("React StatePresetBlock", () => {
  afterEach(() => {
    cleanupReact();
    vi.restoreAllMocks();
  });

  it("falls back to the preset default layout when the requested layout is unsupported", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const view = renderReact(
      <StatePresetBlock blockId="empty-collection" layout="inline" />,
    );

    expect(view.getBySelector(".sk-shell").getAttribute("data-layout")).toBe(
      "panel",
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[StateKit] "EmptyState" does not support the "inline" layout. Falling back to "panel".',
    );
  });

  it("keeps preset defaults when props are undefined and removes CTA when null is passed", () => {
    const view = renderReact(
      <StatePresetBlock blockId="no-permission" secondaryAction={null} />,
    );

    expect(view.getBySelector(".sk-shell__title").textContent).toBe(
      "You do not have access",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-category")).toBe(
      "permission",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-layout")).toBe(
      "panel",
    );
    expect(view.getBySelector(".sk-shell__action").textContent).toBe(
      "Request access",
    );
    expect(view.getAllBySelector(".sk-shell__action")).toHaveLength(1);
  });

  it("applies explicit prop overrides on top of preset metadata", () => {
    const view = renderReact(
      <StatePresetBlock
        blockId="first-project"
        title="Ship the launch workspace"
        description="Override the preset copy for a custom onboarding flow."
        tone="success"
        density="compact"
        primaryAction={{ label: "Launch now" }}
      />,
    );

    expect(view.getBySelector(".sk-shell__title").textContent).toBe(
      "Ship the launch workspace",
    );
    expect(view.getBySelector(".sk-shell__description").textContent).toBe(
      "Override the preset copy for a custom onboarding flow.",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-tone")).toBe(
      "success",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-density")).toBe(
      "compact",
    );
    expect(view.getBySelector(".sk-shell__action").textContent).toBe(
      "Launch now",
    );
    expect(view.getAllBySelector(".sk-shell__action")).toHaveLength(2);
  });

  it("passes through supported layouts without warning and keeps the metadata category", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const view = renderReact(
      <StatePresetBlock blockId="session-expired" layout="page" />,
    );

    expect(view.getBySelector(".sk-shell").getAttribute("data-category")).toBe(
      "permission",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-layout")).toBe(
      "page",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-tone")).toBe(
      "warning",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-density")).toBe(
      "cozy",
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
