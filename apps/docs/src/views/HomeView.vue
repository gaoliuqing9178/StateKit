<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allRecipeDocs, featuredRecipeDocs } from "../lib/recipe-docs";
import { examplePages, homeCopy } from "../lib/copy";
import { getCategoryLabel, getCategorySections } from "../lib/category-docs";
import { useLocale } from "../lib/i18n";
import { getRecipeCopy } from "../lib/recipe-i18n";

const { locale, routePath } = useLocale();
const copy = computed(() => homeCopy[locale.value]);
const categoryOverview = computed(() => getCategorySections(locale.value));

const heroStats = computed(() => [
  {
    value: String(categoryOverview.value.length).padStart(2, "0"),
    label: copy.value.heroStats.categories,
  },
  {
    value: String(allRecipeDocs.length).padStart(2, "0"),
    label: copy.value.heroStats.recipes,
  },
  {
    value: String(featuredRecipeDocs.length).padStart(2, "0"),
    label: copy.value.heroStats.featured,
  },
]);

const featuredRecipes = computed(() =>
  featuredRecipeDocs.slice(0, 4).map((recipe) => ({
    ...recipe,
    categoryLabel: getCategoryLabel(locale.value, recipe.category),
    localized: getRecipeCopy(recipe, locale.value),
  })),
);

const localizedExamplePages = computed(() => examplePages[locale.value]);
</script>

<template>
  <section class="page-stack">
    <section class="home-hero">
      <div class="home-hero__inner">
        <div class="home-hero__copy">
          <p class="eyebrow eyebrow--light">{{ copy.eyebrow }}</p>
          <p class="hero-brand">StateKit</p>
          <h1>{{ copy.title }}</h1>
          <p class="hero-lead">{{ copy.description }}</p>

          <div class="button-row button-row--hero">
            <RouterLink
              class="button-link"
              data-testid="home-browse-recipes"
              :to="routePath('/recipes')"
            >
              {{ copy.browseRecipes }}
            </RouterLink>
            <RouterLink
              class="button-link is-secondary"
              data-testid="home-open-installation"
              :to="routePath('/docs/installation')"
            >
              {{ copy.installation }}
            </RouterLink>
          </div>

          <div class="hero-stats" aria-label="StateKit quick stats">
            <div v-for="stat in heroStats" :key="stat.label" class="hero-stat">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="hero-blueprint" aria-hidden="true">
          <div class="hero-blueprint__core">
            <p>{{ copy.blueprintEyebrow }}</p>
            <strong>{{ copy.blueprintTitle }}</strong>
            <span>
              {{ copy.blueprintDescription }}
            </span>
          </div>

          <div class="hero-blueprint__bands">
            <span v-for="item in categoryOverview" :key="item.category">
              {{ item.label }} · {{ item.count }} {{ copy.recipeCount }}
            </span>
          </div>

          <div
            v-for="recipe in featuredRecipes.slice(0, 3)"
            :key="recipe.id"
            class="hero-blueprint__note"
          >
            <p>{{ recipe.categoryLabel }}</p>
            <strong>{{ recipe.localized.defaults.title }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="section-card section-card--soft">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ copy.coverageEyebrow }}</p>
          <h2>{{ copy.coverageTitle }}</h2>
        </div>
        <p>
          {{ copy.coverageDescription }}
        </p>
      </div>

      <div class="category-grid">
        <article
          v-for="item in categoryOverview"
          :key="item.category"
          class="category-panel"
        >
          <span class="meta-pill">{{ item.count }} {{ copy.recipeCount }}</span>
          <h3>{{ item.label }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="section-card section-card--outline">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ copy.launchEyebrow }}</p>
          <h2>{{ copy.launchTitle }}</h2>
        </div>
        <p>
          {{ copy.launchDescription }}
        </p>
      </div>

      <div class="feature-list">
        <RouterLink
          v-for="recipe in featuredRecipes"
          :key="recipe.id"
          class="feature-item"
          :data-testid="`home-featured-recipe-${recipe.slug}`"
          :to="routePath('/recipes/' + recipe.slug)"
        >
          <div class="feature-item__copy">
            <p class="block-card__eyebrow">{{ recipe.categoryLabel }}</p>
            <h3>{{ recipe.localized.defaults.title }}</h3>
            <p>{{ recipe.localized.summary }}</p>
          </div>

          <div class="feature-item__meta">
            <span class="meta-pill">{{ copy.entryLabel }} {{ recipe.componentName }}</span>
            <span class="meta-pill">{{ recipe.supportedLayouts.join(" · ") }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="section-card section-card--outline">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ copy.examplesEyebrow }}</p>
          <h2>{{ copy.examplesTitle }}</h2>
        </div>
        <p>
          {{ copy.examplesDescription }}
        </p>
      </div>

      <div class="editorial-grid">
        <RouterLink
          v-for="(page, index) in localizedExamplePages"
          :key="page.href"
          class="editorial-link"
          :data-testid="`home-example-link-${page.href.split('/').pop()}`"
          :to="routePath(page.href)"
        >
          <span class="editorial-link__index">0{{ index + 1 }}</span>
          <div>
            <h3>{{ page.title }}</h3>
            <p>{{ page.description }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="section-card section-card--cta">
      <div>
        <p class="eyebrow">{{ copy.startEyebrow }}</p>
        <h2>{{ copy.startTitle }}</h2>
      </div>
      <RouterLink
        class="button-link"
        data-testid="home-bottom-installation"
        :to="routePath('/docs/installation')"
      >
        {{ copy.bottomInstallation }}
      </RouterLink>
    </section>
  </section>
</template>
