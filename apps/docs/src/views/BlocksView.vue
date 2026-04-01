<script setup lang="ts">
/**
 * StateKit ?????
 * 1. block ??????
 * 2. ???????????????????????????????
 * 3. ??????????????????????????????
 */
import { RouterLink } from "vue-router";
import { allBlockDocs } from "../lib/block-docs";
</script>

<template>
  <section class="page-stack">
    <section class="section-card">
      <h1>Prebuilt states by scenario</h1>
      <div class="block-grid">
        <RouterLink
          v-for="block in allBlockDocs"
          :key="block.id"
          class="block-card"
          :to="'/blocks/' + block.slug"
          ><p class="block-card__eyebrow">{{ block.category }}</p>
          <h3>{{ block.defaults.title }}</h3>
          <p>{{ block.summary }}</p>
          <span class="meta-chip">{{
            block.supportedLayouts.join(" / ")
          }}</span></RouterLink
        >
      </div>
    </section>
  </section>
</template>
