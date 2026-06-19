import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OnboardingState,
  PermissionState,
  SuccessState,
  UpgradeState,
} from "@statekit-vue/react";
import { cleanupReact, clickElement, renderReact } from "../test-utils";

const categoryEntryCases = [
  {
    name: "EmptyState",
    component: EmptyState,
    category: "empty",
    title: "Nothing here yet",
    description: "Create your first item or change the current view to keep moving.",
    tone: "neutral",
    density: "cozy",
    layout: "panel",
    actions: ["Create item", "Import"],
  },
  {
    name: "LoadingState",
    component: LoadingState,
    category: "loading",
    title: "Loading this view",
    description: "We are preparing the latest data and layout for this screen.",
    tone: "neutral",
    density: "cozy",
    layout: "panel",
    actions: [],
  },
  {
    name: "OnboardingState",
    component: OnboardingState,
    category: "onboarding",
    title: "Welcome to your launch workspace",
    description:
      "Bring projects, approvals, and teammates into one guided flow so the team can start shipping without rebuilding the basics.",
    tone: "brand",
    density: "spacious",
    layout: "page",
    actions: ["Start guided setup", "Watch quick walkthrough"],
  },
  {
    name: "ErrorState",
    component: ErrorState,
    category: "error",
    title: "Something went wrong",
    description: "Try again or return to a stable place while we recover this view.",
    tone: "danger",
    density: "cozy",
    layout: "panel",
    actions: ["Try again", "Go back"],
  },
  {
    name: "PermissionState",
    component: PermissionState,
    category: "permission",
    title: "You do not have access",
    description: "Request access or return to a page you can use right now.",
    tone: "warning",
    density: "cozy",
    layout: "panel",
    actions: ["Request access", "Go back"],
  },
  {
    name: "UpgradeState",
    component: UpgradeState,
    category: "upgrade",
    title: "Upgrade to continue",
    description: "Move to a higher plan to unlock this workflow and higher limits.",
    tone: "brand",
    density: "cozy",
    layout: "panel",
    actions: ["Upgrade plan", "Compare plans"],
  },
  {
    name: "SuccessState",
    component: SuccessState,
    category: "success",
    title: "Done",
    description:
      "This step completed successfully. Review the result or continue to the next task.",
    tone: "success",
    density: "cozy",
    layout: "panel",
    actions: ["View results", "Continue"],
  },
] as const;

describe("React category-first entries", () => {
  afterEach(() => {
    cleanupReact();
  });

  it.each(categoryEntryCases)(
    "renders $name with the expected default semantics",
    ({ component: Component, category, title, description, tone, density, layout, actions }) => {
      const view = renderReact(<Component />);
      const shell = view.getBySelector(".sk-shell");

      expect(shell.getAttribute("data-category")).toBe(category);
      expect(shell.getAttribute("data-tone")).toBe(tone);
      expect(shell.getAttribute("data-density")).toBe(density);
      expect(shell.getAttribute("data-layout")).toBe(layout);
      expect(view.getBySelector(".sk-shell__kicker").textContent).toBe(
        category.charAt(0).toUpperCase() + category.slice(1),
      );
      expect(view.getBySelector(".sk-shell__title").textContent).toBe(title);
      expect(view.getBySelector(".sk-shell__description").textContent).toBe(
        description,
      );
      expect(
        view.getAllBySelector(".sk-shell__action").map((action) => action.textContent),
      ).toEqual(actions);
    },
  );

  it("lets actionless entries add CTA overrides through the shared merge layer", () => {
    const view = renderReact(
      <LoadingState
        title="Syncing finance records"
        layout="inline"
        primaryAction={{ label: "Open job log" }}
      />,
    );

    expect(view.getBySelector(".sk-shell").getAttribute("data-category")).toBe(
      "loading",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-layout")).toBe(
      "inline",
    );
    expect(view.getBySelector(".sk-shell__title").textContent).toBe(
      "Syncing finance records",
    );
    expect(view.getAllBySelector(".sk-shell__action")).toHaveLength(1);
    expect(view.getBySelector(".sk-shell__action").textContent).toBe("Open job log");
  });

  it("applies explicit overrides and allows removing the default secondary CTA", () => {
    const view = renderReact(
      <SuccessState
        title="Workspace delivered"
        description="Open the launch report and hand the workspace to operations."
        tone="brand"
        density="spacious"
        layout="page"
        primaryAction={{
          label: "Open launch report",
          href: "/reports/launch",
        }}
        secondaryAction={null}
      />,
    );

    const action = view.getBySelector(".sk-shell__action");

    expect(view.getBySelector(".sk-shell").getAttribute("data-category")).toBe(
      "success",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-tone")).toBe("brand");
    expect(view.getBySelector(".sk-shell").getAttribute("data-density")).toBe(
      "spacious",
    );
    expect(view.getBySelector(".sk-shell").getAttribute("data-layout")).toBe(
      "page",
    );
    expect(view.getBySelector(".sk-shell__title").textContent).toBe(
      "Workspace delivered",
    );
    expect(view.getAllBySelector(".sk-shell__action")).toHaveLength(1);
    expect(action.tagName).toBe("A");
    expect(action.getAttribute("href")).toBe("/reports/launch");
    expect(action.textContent).toBe("Open launch report");
  });

  it("keeps OnboardingState default actions on the shared shell action contract", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    const view = renderReact(
      <OnboardingState
        primaryAction={{
          label: "Start guided setup",
          loading: true,
          loadingLabel: "Starting setup...",
          onClick,
        }}
      />,
    );

    const action = view.getBySelector(".sk-shell__action");

    expect(action.textContent).toBe("Starting setup...");
    expect(action.getAttribute("aria-busy")).toBe("true");
    expect(action.getAttribute("aria-disabled")).toBe("true");
    expect(action.hasAttribute("disabled")).toBe(true);

    clickElement(action);

    expect(onClick).not.toHaveBeenCalled();
  });
});
