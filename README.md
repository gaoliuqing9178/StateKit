# StateKit

Scenario-first state UI building blocks for SaaS products built with Vue.

[简体中文](./README.zh-CN.md)

StateKit focuses on the product states teams rebuild constantly but rarely standardize well: empty, loading, error, permission, upgrade, and success. It is not a general-purpose library for buttons, forms, or modals. It is a narrow layer for product-grade state interfaces and workflow checkpoints.

## What StateKit Covers

V1 currently ships 18 prebuilt blocks across six categories:

- Empty states
- Loading states
- Error states
- Permission states
- Upgrade states
- Success states

Onboarding-style entry points are currently handled through first-run empty states such as `FirstProjectState`.

## Quick Start

```bash
npm install @statekit/vue
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import "@statekit/vue/styles.css";
import { EmptySearchState } from "@statekit/vue";

const clearing = ref(false);

async function handleClearFilters() {
  clearing.value = true;
  try {
    await Promise.resolve();
  } finally {
    clearing.value = false;
  }
}
</script>

<template>
  <EmptySearchState
    title="No matching invoices"
    description="Try a different keyword or clear your current filters."
    :primary-action="{
      label: 'Clear filters',
      onClick: handleClearFilters,
      loading: clearing,
      loadingLabel: 'Clearing filters...',
    }"
    :secondary-action="{
      label: 'Create invoice',
      href: '/invoices/new',
    }"
  />
</template>
```

## Shared Preset API

All preset blocks share the same base prop surface:

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

## CTA Action Object

`primaryAction` and `secondaryAction` both accept `StateAction | null | undefined`.

A `StateAction` can include:

- `label`: required button text
- `href`: optional link target; when present the action renders as an anchor
- `onClick`: optional click handler for either buttons or links
- `loading`: optional busy state controlled by the consumer
- `loadingLabel`: optional busy text that replaces the default `Working...`
- `disabled`: optional unavailable state that keeps the action visible

Passing rules:

- Use plain attributes for fixed strings and enum values such as `layout="panel"` or `tone="brand"`.
- Use `:` bindings for variables, objects, booleans, and `null`.
- In Vue templates, prop names stay kebab-case: `primaryAction` becomes `primary-action`, and `secondaryAction` becomes `secondary-action`.
- Leaving an action prop `undefined` keeps the preset default.
- Passing `null` removes the preset action explicitly.
- Put CTA behavior inside `primaryAction.onClick` or `secondaryAction.onClick`, not on the block root.

## Docs And Examples

- `npm run dev:docs` opens the local docs app with block previews, install guidance, and example routes.
- Each block detail page now documents:
  - how to customize `title` and `description`
  - how to pass props directly, from script bindings, or through `v-bind`
  - how to wire `primaryAction` and `secondaryAction`
  - how to use `onClick`, `href`, `loading`, `loadingLabel`, `disabled`, and `null`
- The docs example routes now cover:
  - `Admin Empty States`
  - `Permissions And Upgrade`
  - `Task Flow`
- `npm run dev:example` opens the external admin-style integration example in `examples/vite-vue-admin`.

## Repository Layout

```text
apps/docs
packages/shared
packages/vue
examples/vite-vue-admin
docs
```

- `apps/docs`: local documentation app with block previews, detailed block guides, installation guidance, and scenario example routes.
- `packages/shared`: shared types, ids, metadata, and priority lists that act as the single source of truth.
- `packages/vue`: Vue preset components and the default stylesheet.
- `examples/vite-vue-admin`: admin-style integration example using the current CTA action API.
- `docs`: internal product, implementation, QA, and launch documentation.

## Local Development

Run these commands from the workspace root:

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
```

## Docs And Release Notes

- Read internal planning and specs in [`docs/`](./docs)
- See versioned release notes in [`CHANGELOG.md`](./CHANGELOG.md)

## Positioning

Use StateKit when you want consistent state interfaces for SaaS dashboards, admin panels, workspaces, and collaboration products without re-deciding layout, tone, and CTA structure for every edge case.

Do not use StateKit as a replacement for a full design system. It is intentionally narrow: scenario-first state blocks, not a complete UI foundation.