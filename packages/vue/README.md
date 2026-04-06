# @statekit-vue/vue

Category-first Vue state UI for SaaS products.

`@statekit-vue/vue` is the main public package for StateKit. Install it when your app needs production-ready empty, loading, error, permission, upgrade, and success states without rebuilding layout, copy structure, and CTA behavior from scratch.

## Install

```bash
npm install @statekit-vue/vue
```

Peer dependency:

- `vue@^3.4.0`

## Quick Start

```vue
<script setup lang="ts">
import { ref } from "vue";
import "@statekit-vue/vue/styles.css";
import { EmptyState } from "@statekit-vue/vue";

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
  <EmptyState
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

## What It Includes

- Six category-first public components: `EmptyState`, `LoadingState`, `ErrorState`, `PermissionState`, `UpgradeState`, and `SuccessState`
- 18 preset recipes and compatibility exports across the same six categories
- Shared prop surface for `title`, `description`, `tone`, `density`, `layout`, `primaryAction`, and `secondaryAction`
- Built-in stylesheet entry at `@statekit-vue/vue/styles.css`
- Re-exports from `@statekit-vue/shared` for recipe metadata and shared types

Onboarding-style entry points currently live inside the empty-state category through first-run presets such as `FirstProjectState`.
Prefer the unified category entries in new code and customize the copy, layout, and actions per screen. Older scenario-specific exports remain available as deprecated compatibility presets.

## Shared Preset API

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
