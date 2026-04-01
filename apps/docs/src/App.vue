<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="site-shell">
    <div class="site-shell__aurora" aria-hidden="true">
      <span class="site-shell__glow is-primary" />
      <span class="site-shell__glow is-secondary" />
      <span class="site-shell__mesh" />
    </div>

    <header class="site-header">
      <div class="site-header__inner">
        <RouterLink class="site-brand" to="/">
          <span class="site-brand__mark">SK</span>
          <span class="site-brand__text">
            <strong>StateKit</strong>
            <small>Vue State Docs</small>
          </span>
        </RouterLink>

        <nav class="site-nav" aria-label="Primary">
          <RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path === '/' }"
            to="/"
          >
            Home
          </RouterLink>
          <RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path.startsWith('/blocks') }"
            to="/blocks"
          >
            Blocks
          </RouterLink>
          <RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path.startsWith('/examples') }"
            to="/examples/admin-empty-states"
          >
            Examples
          </RouterLink>
          <RouterLink
            class="site-nav__link"
            :class="{ 'is-active': route.path.startsWith('/docs') }"
            to="/docs/installation"
          >
            Install
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <RouterView v-slot="{ Component, route: viewRoute }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="viewRoute.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
