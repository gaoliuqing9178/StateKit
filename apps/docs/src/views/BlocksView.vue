<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allBlockDocs } from "../lib/block-docs";

const categoryLabels = {
  empty: "Empty",
  loading: "Loading",
  error: "Error",
  permission: "Permission",
  upgrade: "Upgrade",
  success: "Success",
} as const;

const categoryDescriptions = {
  empty: "Blank collections, empty searches, and first-run starting points.",
  loading: "States that hold structure while content is still arriving.",
  error: "Failures that need retry, recovery, or a safe way out.",
  permission: "Access restrictions tied to role, resource, or session state.",
  upgrade: "Quota and plan gates that still read like product flow.",
  success: "Completion moments that keep momentum after the task ends.",
} as const;

const categorySections = computed(() =>
  (["empty", "loading", "error", "permission", "upgrade", "success"] as const).map(
    (category) => ({
      category,
      label: categoryLabels[category],
      description: categoryDescriptions[category],
      blocks: allBlockDocs.filter((block) => block.category === category),
    }),
  ),
);

const launchCount = computed(
  () => allBlockDocs.filter((block) => block.priority === "launch").length,
);
</script>

<template>
  <section class="page-stack">
    <section class="page-hero">
      <div>
        <p class="eyebrow">Block Index</p>
        <h1>Prebuilt states by scenario</h1>
        <p>
          Browse the full V1 catalog, compare adjacent moments inside the same
          category, and jump from metadata to live preview without losing
          context.
        </p>
      </div>

      <div class="page-hero__facts">
        <div class="page-fact">
          <strong>{{ allBlockDocs.length }}</strong>
          <span>Total blocks</span>
        </div>
        <div class="page-fact">
          <strong>{{ launchCount }}</strong>
          <span>Launch priority</span>
        </div>
        <div class="page-fact">
          <strong>{{ categorySections.length }}</strong>
          <span>Categories</span>
        </div>
      </div>
    </section>

    <section
      v-for="section in categorySections"
      :key="section.category"
      class="section-card section-card--outline"
    >
      <div class="section-heading section-heading--inline">
        <div>
          <p class="eyebrow">{{ section.category }}</p>
          <h2>{{ section.label }} states</h2>
          <p>{{ section.description }}</p>
        </div>
        <span class="meta-pill meta-pill--solid">{{ section.blocks.length }} blocks</span>
      </div>

      <div class="block-list">
        <RouterLink
          v-for="block in section.blocks"
          :key="block.id"
          class="block-list__item"
          :to="'/blocks/' + block.slug"
        >
          <div class="block-list__main">
            <p class="block-card__eyebrow">{{ block.category }}</p>
            <h3>{{ block.defaults.title }}</h3>
            <p>{{ block.summary }}</p>
          </div>

          <div class="block-list__meta">
            <span class="meta-pill">{{ block.componentName }}</span>
            <span class="meta-pill">{{ block.supportedLayouts.join(" · ") }}</span>
            <span
              class="meta-pill"
              :class="{ 'meta-pill--accent': block.priority === 'launch' }"
            >
              {{ block.priority }}
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </section>
</template>
