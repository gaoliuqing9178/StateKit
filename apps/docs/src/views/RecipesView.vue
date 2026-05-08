<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allRecipeDocs } from "../lib/recipe-docs";
import { recipeIndexCopy } from "../lib/copy";
import { getCategorySections, getCategoryLabel } from "../lib/category-docs";
import { useLocale } from "../lib/i18n";
import { getRecipeCopy } from "../lib/recipe-i18n";

const { locale, routePath } = useLocale();
const copy = computed(() => recipeIndexCopy[locale.value]);
const categorySections = computed(() =>
  getCategorySections(locale.value).map((section) => ({
    ...section,
    recipes: allRecipeDocs
      .filter((recipe) => recipe.category === section.category)
      .map((recipe) => ({
        ...recipe,
        categoryLabel: getCategoryLabel(locale.value, recipe.category),
        localized: getRecipeCopy(recipe, locale.value),
      })),
  })),
);

const launchRecipeCount = computed(
  () => allRecipeDocs.filter((recipe) => recipe.priority === "launch").length,
);
</script>

<template>
  <section class="page-stack">
    <section class="page-hero">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h1>{{ copy.title }}</h1>
        <p>
          {{ copy.description }}
        </p>
      </div>

      <div class="page-hero__facts">
        <div class="page-fact">
          <strong>{{ allRecipeDocs.length }}</strong>
          <span>{{ copy.totalRecipes }}</span>
        </div>
        <div class="page-fact">
          <strong>{{ launchRecipeCount }}</strong>
          <span>{{ copy.launchPriority }}</span>
        </div>
        <div class="page-fact">
          <strong>{{ categorySections.length }}</strong>
          <span>{{ copy.categories }}</span>
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
          <p class="eyebrow">{{ section.label }}</p>
          <h2>{{ copy.sectionRecipeTitle(section.label) }}</h2>
          <p>{{ section.listDescription }}</p>
        </div>
        <span class="meta-pill meta-pill--solid">
          {{ section.count }} {{ copy.recipeSuffix }}
        </span>
      </div>

      <div class="block-list" :data-testid="`recipe-list-${section.category}`">
        <RouterLink
          v-for="recipe in section.recipes"
          :key="recipe.id"
          class="block-list__item"
          :data-testid="`recipe-link-${recipe.slug}`"
          :to="routePath('/recipes/' + recipe.slug)"
        >
          <div class="block-list__main">
            <p class="block-card__eyebrow">{{ recipe.categoryLabel }}</p>
            <h3>{{ recipe.localized.defaults.title }}</h3>
            <p>{{ recipe.localized.summary }}</p>
          </div>

          <div class="block-list__meta">
            <span class="meta-pill">{{ copy.entryLabel }} {{ recipe.componentName }}</span>
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
