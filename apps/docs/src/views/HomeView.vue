<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ????????
 * 2. ????????????????? block ????????????
 * 3. ????????????????? CTA ????????????
 */
import { RouterLink } from "vue-router";
import { featuredBlockDocs } from "../lib/block-docs";
import { examplePages, homeCopy } from "../lib/copy";
</script>

<template>
  <section class="page-stack">
    <section class="section-card">
      <p class="eyebrow">{{ homeCopy.eyebrow }}</p>
      <h1>{{ homeCopy.title }}</h1>
      <p>{{ homeCopy.description }}</p>
      <div class="button-row">
        <RouterLink class="button-link" to="/blocks">Browse blocks</RouterLink
        ><RouterLink class="button-link is-secondary" to="/docs/installation"
          >Installation</RouterLink
        >
      </div>
    </section>
    <section class="section-card">
      <h2>Featured blocks</h2>
      <div class="block-grid">
        <RouterLink
          v-for="block in featuredBlockDocs"
          :key="block.id"
          class="block-card"
          :to="'/blocks/' + block.slug"
          ><p class="block-card__eyebrow">{{ block.category }}</p>
          <h3>{{ block.defaults.title }}</h3>
          <p>{{ block.summary }}</p></RouterLink
        >
      </div>
    </section>
    <section class="section-card">
      <h2>Example pages</h2>
      <div class="block-grid">
        <RouterLink
          v-for="page in examplePages"
          :key="page.href"
          class="block-card"
          :to="page.href"
          ><h3>{{ page.title }}</h3>
          <p>{{ page.description }}</p></RouterLink
        >
      </div>
    </section>
  </section>
</template>
