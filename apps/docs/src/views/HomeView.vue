<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allRecipeDocs, featuredRecipeDocs } from "../lib/recipe-docs";
import { examplePages, homeCopy } from "../lib/copy";

const heroStats = computed(() => [
  {
    value: "06",
    label: "Category entries",
  },
  {
    value: String(allRecipeDocs.length).padStart(2, "0"),
    label: "Preset recipes",
  },
  {
    value: String(featuredRecipeDocs.length).padStart(2, "0"),
    label: "Launch recipes",
  },
]);

const categoryDescriptions = {
  empty:
    "First-run onboarding, empty searches, and blank collections that need the next move.",
  loading:
    "Processing states that keep structure visible while the system catches up.",
  error:
    "Recoverable and blocking failures with the right amount of urgency.",
  permission:
    "Role limits, access gates, and expired sessions that read as product rules.",
  upgrade:
    "Plan and quota moments that guide a decision without turning into marketing.",
  success:
    "Completion states that close the loop and point to the next useful action.",
} as const;

const categoryOverview = computed(() =>
  (["empty", "loading", "error", "permission", "upgrade", "success"] as const).map(
    (category) => ({
      category,
      count: allRecipeDocs.filter((recipe) => recipe.category === category).length,
      description: categoryDescriptions[category],
    }),
  ),
);

const featuredRecipes = computed(() => featuredRecipeDocs.slice(0, 4));
</script>

<template>
  <section class="page-stack">
    <section class="home-hero">
      <div class="home-hero__inner">
        <div class="home-hero__copy">
          <p class="eyebrow eyebrow--light">{{ homeCopy.eyebrow }}</p>
          <p class="hero-brand">StateKit</p>
          <h1>{{ homeCopy.title }}</h1>
          <p class="hero-lead">{{ homeCopy.description }}</p>

          <div class="button-row button-row--hero">
            <RouterLink class="button-link" to="/recipes">Browse recipes</RouterLink>
            <RouterLink class="button-link is-secondary" to="/docs/installation">
              Installation
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
            <p>Shared metadata</p>
            <strong>Category-first components</strong>
            <span>
              Six public entries backed by 18 preset recipes across empty,
              loading, error, permission, upgrade, and success.
            </span>
          </div>

          <div class="hero-blueprint__bands">
            <span v-for="item in categoryOverview" :key="item.category">
              {{ item.category }} · {{ item.count }} recipes
            </span>
          </div>

          <div
            v-for="recipe in featuredRecipes.slice(0, 3)"
            :key="recipe.id"
            class="hero-blueprint__note"
          >
            <p>{{ recipe.category }}</p>
            <strong>{{ recipe.defaults.title }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="section-card section-card--soft">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Coverage</p>
          <h2>State categories that belong in the product surface</h2>
        </div>
        <p>
          Every public category entry shares the same core API, while each
          recipe keeps its own default tone, placement, and user expectation.
        </p>
      </div>

      <div class="category-grid">
        <article
          v-for="item in categoryOverview"
          :key="item.category"
          class="category-panel"
        >
          <span class="meta-pill">{{ item.count }} recipes</span>
          <h3>{{ item.category }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="section-card section-card--outline">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Launch Set</p>
          <h2>Priority recipes teams usually need first</h2>
        </div>
        <p>
          These are the launch-tier recipes already marked as featured in the
          shared metadata layer.
        </p>
      </div>

      <div class="feature-list">
        <RouterLink
          v-for="recipe in featuredRecipes"
          :key="recipe.id"
          class="feature-item"
          :to="'/recipes/' + recipe.slug"
        >
          <div class="feature-item__copy">
            <p class="block-card__eyebrow">{{ recipe.category }}</p>
            <h3>{{ recipe.defaults.title }}</h3>
            <p>{{ recipe.summary }}</p>
          </div>

          <div class="feature-item__meta">
            <span class="meta-pill">Entry {{ recipe.componentName }}</span>
            <span class="meta-pill">{{ recipe.supportedLayouts.join(" · ") }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="section-card section-card--outline">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Examples</p>
          <h2>See the recipes inside workflows, not just in isolation</h2>
        </div>
        <p>
          Each example page places states back into a believable SaaS surface so
          spacing, hierarchy, and CTA tone can be evaluated in context.
        </p>
      </div>

      <div class="editorial-grid">
        <RouterLink
          v-for="(page, index) in examplePages"
          :key="page.href"
          class="editorial-link"
          :to="page.href"
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
        <p class="eyebrow">Start</p>
        <h2>Install one category component, then rewrite only the product copy.</h2>
      </div>
      <RouterLink class="button-link" to="/docs/installation">
        Open installation guide
      </RouterLink>
    </section>
  </section>
</template>
