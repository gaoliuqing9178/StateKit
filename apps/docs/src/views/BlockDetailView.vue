<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { blockComponentMap } from "../lib/block-components";
import { allBlockDocs, getBlockDocBySlug } from "../lib/block-docs";
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

const defaultActions = computed(() =>
  blockMeta.value
    ? [
        blockMeta.value.defaults.primaryAction,
        blockMeta.value.defaults.secondaryAction,
      ]
        .filter((action): action is NonNullable<typeof action> => Boolean(action))
        .map((action) => action.label)
    : [],
);

const relatedBlocks = computed(() => {
  const meta = blockMeta.value;
  if (!meta) {
    return [];
  }

  return allBlockDocs
    .filter((item) => item.category === meta.category && item.id !== meta.id)
    .slice(0, 3);
});
</script>

<template>
  <section class="page-stack">
    <template v-if="blockMeta">
      <section class="page-hero page-hero--detail">
        <div>
          <p class="eyebrow">{{ blockMeta.category }} block</p>
          <h1>{{ blockMeta.defaults.title }}</h1>
          <p>{{ blockMeta.summary }}</p>
        </div>

        <div class="page-hero__facts">
          <div class="page-fact">
            <strong>{{ blockMeta.priority }}</strong>
            <span>Priority</span>
          </div>
          <div class="page-fact">
            <strong>{{ blockMeta.defaults.layout }}</strong>
            <span>Default layout</span>
          </div>
          <div class="page-fact">
            <strong>{{ blockMeta.supportedLayouts.length }}</strong>
            <span>Layouts supported</span>
          </div>
        </div>
      </section>

      <section class="detail-layout">
        <article class="detail-preview">
          <div class="detail-preview__header">
            <div>
              <p class="detail-preview__eyebrow">Live preview</p>
              <h2>{{ blockMeta.componentName }}</h2>
            </div>

            <div class="detail-preview__meta">
              <span class="meta-pill">{{ blockMeta.defaults.tone }}</span>
              <span class="meta-pill">{{ blockMeta.defaults.density }}</span>
              <span class="meta-pill">{{ blockMeta.defaults.layout }}</span>
            </div>
          </div>

          <div class="detail-preview__surface">
            <component
              :is="blockComponent"
              :layout="blockMeta.defaults.layout"
              :density="blockMeta.defaults.density"
              :tone="blockMeta.defaults.tone"
            />
          </div>
        </article>

        <aside class="detail-sidebar">
          <section class="detail-section">
            <h2>Metadata</h2>
            <dl class="detail-definition-list">
              <div>
                <dt>Slug</dt>
                <dd>{{ blockMeta.slug }}</dd>
              </div>
              <div>
                <dt>Component</dt>
                <dd>{{ blockMeta.componentName }}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{{ blockMeta.priority }}</dd>
              </div>
              <div>
                <dt>Layouts</dt>
                <dd>{{ blockMeta.supportedLayouts.join(", ") }}</dd>
              </div>
            </dl>
          </section>

          <section class="detail-section">
            <h2>Defaults</h2>
            <ul class="detail-bullet-list">
              <li><strong>Tone:</strong> {{ blockMeta.defaults.tone }}</li>
              <li><strong>Density:</strong> {{ blockMeta.defaults.density }}</li>
              <li><strong>Layout:</strong> {{ blockMeta.defaults.layout }}</li>
              <li v-if="defaultActions.length">
                <strong>Default actions:</strong> {{ defaultActions.join(", ") }}
              </li>
            </ul>
          </section>

          <section class="detail-section">
            <h2>Usage</h2>
            <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
          </section>
        </aside>
      </section>

      <section
        v-if="relatedBlocks.length"
        class="section-card section-card--outline"
      >
        <div class="section-heading">
          <div>
            <p class="eyebrow">Related</p>
            <h2>More blocks in the same category</h2>
          </div>
          <p>
            Use these when the moment changes but the user still expects the
            same semantic family.
          </p>
        </div>

        <div class="related-grid">
          <RouterLink
            v-for="item in relatedBlocks"
            :key="item.id"
            class="editorial-link"
            :to="'/blocks/' + item.slug"
          >
            <span class="editorial-link__index">{{ item.category }}</span>
            <div>
              <h3>{{ item.defaults.title }}</h3>
              <p>{{ item.summary }}</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </template>

    <section v-else class="section-card section-card--empty">
      <p class="eyebrow">Missing</p>
      <h1>Block not found</h1>
      <p>The requested slug does not match any block in the shared metadata.</p>
    </section>
  </section>
</template>
