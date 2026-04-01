<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ???????
 * 2. ?????????????????????? docs ????????
 * 3. ????????????????????????????????
 */
import { RouterLink, RouterView, useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <RouterLink class="site-brand" to="/">StateKit</RouterLink>
        <nav class="site-nav" aria-label="Primary">
          <RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path === '/' }"
            to="/"
            >Home</RouterLink
          ><RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path.startsWith('/blocks') }"
            to="/blocks"
            >Blocks</RouterLink
          ><RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path.startsWith('/examples') }"
            to="/examples/admin-empty-states"
            >Examples</RouterLink
          ><RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path.startsWith('/docs') }"
            to="/docs/installation"
            >Install</RouterLink
          >
        </nav>
      </div>
    </header>
    <main class="site-main"><RouterView /></main>
  </div>
</template>
