<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allBlockDocs, featuredBlockDocs } from "../lib/block-docs";
import { examplePages, homeCopy } from "../lib/copy";

const heroStats = computed(() => [
  {
    value: String(allBlockDocs.length).padStart(2, "0"),
    label: "Preset blocks",
  },
  {
    value: String(featuredBlockDocs.length).padStart(2, "0"),
    label: "Launch states",
  },
  {
    value: "03",
    label: "Layouts",
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
      count: allBlockDocs.filter((block) => block.category === category).length,
      description: categoryDescriptions[category],
    }),
  ),
);

const featuredShowcase = computed(() => featuredBlockDocs.slice(0, 4));
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
            <RouterLink class="button-link" to="/blocks">Browse blocks</RouterLink>
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
            <strong>Scenario-first blocks</strong>
            <span>
              One API across empty, loading, error, permission, upgrade, and
              success.
            </span>
          </div>

          <div class="hero-blueprint__bands">
            <span v-for="item in categoryOverview" :key="item.category">
              {{ item.category }} · {{ item.count }}
            </span>
          </div>

          <div
            v-for="block in featuredShowcase.slice(0, 3)"
            :key="block.id"
            class="hero-blueprint__note"
          >
            <p>{{ block.category }}</p>
            <strong>{{ block.defaults.title }}</strong>
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
          Every preset shares the same core API, but each category still keeps
          its own tone, placement, and user expectation.
        </p>
      </div>

      <div class="category-grid">
        <article
          v-for="item in categoryOverview"
          :key="item.category"
          class="category-panel"
        >
          <span class="meta-pill">{{ item.count }} blocks</span>
          <h3>{{ item.category }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="section-card section-card--outline">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Launch Set</p>
          <h2>Priority blocks teams usually need first</h2>
        </div>
        <p>
          These are the launch-tier states already marked as featured in the
          shared metadata layer.
        </p>
      </div>

      <div class="feature-list">
        <RouterLink
          v-for="block in featuredShowcase"
          :key="block.id"
          class="feature-item"
          :to="'/blocks/' + block.slug"
        >
          <div class="feature-item__copy">
            <p class="block-card__eyebrow">{{ block.category }}</p>
            <h3>{{ block.defaults.title }}</h3>
            <p>{{ block.summary }}</p>
          </div>

          <div class="feature-item__meta">
            <span class="meta-pill">{{ block.componentName }}</span>
            <span class="meta-pill">{{ block.supportedLayouts.join(" · ") }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="section-card section-card--outline">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Examples</p>
          <h2>See the blocks inside workflows, not just in isolation</h2>
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
        <h2>Install one block, then rewrite only the product copy.</h2>
      </div>
      <RouterLink class="button-link" to="/docs/installation">
        Open installation guide
      </RouterLink>
    </section>
  </section>
</template>
