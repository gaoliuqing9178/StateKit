# @statekit/vue

Scenario-first Vue state UI blocks for SaaS products.

`@statekit/vue` is the main package most app teams should install. It ships preset state blocks such as empty, loading, error, permission, upgrade, and success screens, plus the shared stylesheet used by those presets.

## Install

```bash
npm install @statekit/vue
```

## Use

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

## Includes

- 18 preset state blocks for Vue 3
- Shared props for `title`, `description`, `tone`, `density`, `layout`, `primaryAction`, and `secondaryAction`
- Default stylesheet entry at `@statekit/vue/styles.css`

## More

- Repository: https://github.com/gaoliuqing9178/StateKit
- Docs and examples: https://github.com/gaoliuqing9178/StateKit#readme
- Release notes: https://github.com/gaoliuqing9178/StateKit/blob/main/CHANGELOG.md
