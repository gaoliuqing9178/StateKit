# @statekit-vue/react

Category-first React state UI for SaaS products.

`@statekit-vue/react` is the React adapter for StateKit. Install it when your React app needs production-ready empty, onboarding, loading, error, permission, upgrade, and success states without rebuilding layout, copy structure, and CTA behavior from scratch.

The package name keeps the existing `@statekit-vue/*` npm scope for compatibility with the published shared metadata package. The React adapter does not depend on Vue runtime.

## Install

```bash
npm install @statekit-vue/react
```

Peer dependencies:

- `react@^18.2.0 || ^19.0.0`
- `react-dom@^18.2.0 || ^19.0.0`

## Quick Start

```tsx
import { useState } from "react";
import "@statekit-vue/react/styles.css";
import { EmptyState } from "@statekit-vue/react";

export function InvoiceEmptyState() {
  const [clearing, setClearing] = useState(false);

  async function handleClearFilters() {
    setClearing(true);
    try {
      await Promise.resolve();
    } finally {
      setClearing(false);
    }
  }

  return (
    <EmptyState
      title="No matching invoices"
      description="Try a different keyword or clear your current filters."
      primaryAction={{
        label: "Clear filters",
        onClick: handleClearFilters,
        loading: clearing,
        loadingLabel: "Clearing filters...",
      }}
      secondaryAction={{
        label: "Create invoice",
        href: "/invoices/new",
      }}
    />
  );
}
```

## What It Includes

- Seven category-first public components: `EmptyState`, `OnboardingState`, `LoadingState`, `ErrorState`, `PermissionState`, `UpgradeState`, and `SuccessState`
- 21 preset recipes and compatibility exports across the same seven categories
- Shared prop surface for `title`, `description`, `tone`, `density`, `layout`, `primaryAction`, and `secondaryAction`
- React equivalents for Vue slots through `media` and `actions` props
- Built-in stylesheet entry at `@statekit-vue/react/styles.css`
- Re-exports from `@statekit-vue/shared` for recipe metadata and shared types

Prefer the unified category entries in new code and customize the copy, layout, and actions per screen. Older scenario-specific exports remain available as compatibility presets.

## CTA Action Object

`primaryAction` and `secondaryAction` both accept `StateAction | null | undefined`.

A `StateAction` can include:

- `label`: required button text
- `href`: optional link target that renders the action as an anchor
- `onClick`: optional click handler for buttons or links
- `loading`: optional busy state controlled by the consumer
- `loadingLabel`: optional busy text that replaces the default `Working...`
- `disabled`: optional unavailable state that keeps the action visible

Passing `null` removes a preset action explicitly. Leaving an action prop `undefined` keeps the preset default.

## Links

- Repository: https://github.com/gaoliuqing9178/StateKit
- Online docs: https://state-kit-vue-docs.vercel.app/
- Root docs and examples: https://github.com/gaoliuqing9178/StateKit#readme
- Release notes: https://github.com/gaoliuqing9178/StateKit/blob/main/CHANGELOG.md
