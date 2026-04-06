<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allRecipeDocs } from "../lib/recipe-docs";

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
      recipes: allRecipeDocs.filter((recipe) => recipe.category === category),
    }),
  ),
);

const launchRecipeCount = computed(
  () => allRecipeDocs.filter((recipe) => recipe.priority === "launch").length,
);
</script>

<template>
  <section class="page-stack">
    <section class="page-hero">
      <div>
        <p class="eyebrow">Recipe Index</p>
        <h1>Preset recipes by state category</h1>
        <p>
          Browse all 18 preset recipes, compare adjacent moments inside the same
          category, and see which public category entry each recipe resolves
          through.
        </p>
      </div>

      <div class="page-hero__facts">
        <div class="page-fact">
          <strong>{{ allRecipeDocs.length }}</strong>
          <span>Total recipes</span>
        </div>
        <div class="page-fact">
          <strong>{{ launchRecipeCount }}</strong>
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
          <h2>{{ section.label }} recipes</h2>
          <p>{{ section.description }}</p>
        </div>
        <span class="meta-pill meta-pill--solid">{{ section.recipes.length }} recipes</span>
      </div>

      <div class="block-list">
        <RouterLink
          v-for="recipe in section.recipes"
          :key="recipe.id"
          class="block-list__item"
          :to="'/recipes/' + recipe.slug"
        >
          <div class="block-list__main">
            <p class="block-card__eyebrow">{{ recipe.category }}</p>
            <h3>{{ recipe.defaults.title }}</h3>
            <p>{{ recipe.summary }}</p>
          </div>

          <div class="block-list__meta">
            <span class="meta-pill">Entry {{ recipe.componentName }}</span>
            <span class="meta-pill">{{ recipe.supportedLayouts.join(" · ") }}</span>
            <span
              class="meta-pill"
              :class="{ 'meta-pill--accent': recipe.priority === 'launch' }"
            >
              {{ recipe.priority }}
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </section>
</template>
