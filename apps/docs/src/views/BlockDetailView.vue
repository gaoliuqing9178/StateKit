<script setup lang="ts">
/**
 * StateKit ?????
 * 1. block ??????
 * 2. ?????? block ??????????????????????
 * 3. ??????????????? shared ??????????????????
 */
import { computed } from "vue";
import { useRoute } from "vue-router";
import { blockComponentMap } from "../lib/block-components";
import { getBlockDocBySlug } from "../lib/block-docs";
import { blockUsageSnippet } from "../lib/example-code";
const route = useRoute();
const blockMeta = computed(() =>
  getBlockDocBySlug(String(route.params.slug ?? "")),
);
const blockComponent = computed(() =>
  blockMeta.value ? blockComponentMap[blockMeta.value.componentName] : null,
);
const usageSnippet = computed(() =>
  blockMeta.value ? blockUsageSnippet(blockMeta.value) : "",
);
</script>

<template>
  <section class="page-stack">
    <section v-if="blockMeta" class="section-card">
      <p class="eyebrow">{{ blockMeta.category }}</p>
      <h1>{{ blockMeta.defaults.title }}</h1>
      <p>{{ blockMeta.summary }}</p>
      <div class="detail-grid">
        <article class="detail-panel">
          <h2>Live preview</h2>
          <component
            :is="blockComponent"
            :layout="blockMeta.defaults.layout"
            :density="blockMeta.defaults.density"
            :tone="blockMeta.defaults.tone"
          />
        </article>
        <article class="detail-panel">
          <h2>Metadata</h2>
          <ul class="plain-list">
            <li><strong>Slug:</strong> {{ blockMeta.slug }}</li>
            <li><strong>Component:</strong> {{ blockMeta.componentName }}</li>
            <li><strong>Priority:</strong> {{ blockMeta.priority }}</li>
            <li>
              <strong>Layouts:</strong>
              {{ blockMeta.supportedLayouts.join(", ") }}
            </li>
          </ul>
          <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        </article>
      </div>
    </section>
    <section v-else class="section-card"><h1>Block not found</h1></section>
  </section>
</template>
