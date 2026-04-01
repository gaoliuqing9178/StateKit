# StateKit

Scenario-first state UI building blocks for SaaS products built with Vue.

[简体中文](./README.zh-CN.md)

StateKit focuses on the screens teams rebuild in every product but rarely standardize well: empty, loading, error, permission, upgrade, onboarding-style first-run, and success states. It is not a general-purpose component library for buttons, forms, or modals. It is a focused layer for product-grade state interfaces and flow steps.

## What It Covers

- Empty states
- Loading states
- Error states
- Permission states
- Upgrade states
- Success states

V1 currently ships 18 prebuilt blocks across those categories. Onboarding-style entry points are currently represented through first-run empty states such as `FirstProjectState`.

## Quick Start

```bash
npm install @statekit/vue
```

```vue
<script setup lang="ts">
import "@statekit/vue/styles.css";
import { EmptySearchState } from "@statekit/vue";
</script>

<template>
  <EmptySearchState
    title="No matching invoices"
    description="Try a different keyword or clear your current filters."
    :primary-action="{ label: 'Clear filters' }"
    :secondary-action="{ label: 'Create invoice' }"
  />
</template>
```

## Included Building Blocks

Some of the highest-value presets in the current package:

- `EmptySearchState`
- `FirstProjectState`
- `PageErrorState`
- `NoPermissionState`
- `UpgradePlanState`
- `TaskSuccessState`

All blocks share the same core API:

- `title`
- `description`
- `tone`
- `density`
- `layout`
- `primaryAction`
- `secondaryAction`

Supported layouts:

- `inline`
- `panel`
- `page`

Supported tones:

- `neutral`
- `brand`
- `danger`
- `warning`
- `success`

## Packages

```text
apps/docs
packages/shared
packages/vue
examples/vite-vue-admin
docs
```

- `packages/shared`: shared types, block metadata, ids, categories, and defaults.
- `packages/vue`: Vue components and default styles.
- `apps/docs`: local docs app for browsing blocks, installation guidance, and live previews.
- `examples/vite-vue-admin`: admin-style integration example.
- `docs`: internal product, implementation, QA, and launch documentation.

## Local Development

Run these commands from the workspace root:

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

## Project Positioning

Use StateKit when you want consistent state interfaces without rebuilding each scenario from scratch. It is a good fit for SaaS dashboards, admin panels, workspaces, and collaboration products where the hard part is not rendering a box, but getting the product state, copy, tone, and CTA structure right.

Do not use StateKit as a replacement for a full design system. It is intentionally narrow: scenario-first state blocks, not a full UI foundation.

## Docs And References

- Browse the local docs app with `npm run dev:docs`
- Check the admin example with `npm run dev:example`
- See internal planning and specs in [`docs/`](./docs)
