<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ??????????
 * 2. ??????????????????? StateKit ?????????????????
 * 3. ????????????????????????????????
 */
import {
  EmptySearchState,
  LoadingTableState,
  NoPermissionState,
  TaskSuccessState,
  UpgradePlanState,
} from "@statekit/vue";
const navItems = [
  { label: "Overview", count: "12" },
  { label: "Campaigns", count: "08" },
  { label: "Assets", count: "214" },
  { label: "Automation", count: "05" },
] as const;
const metrics = [
  { label: "Active campaigns", value: "24", detail: "+6 this week" },
  { label: "Approval rate", value: "93%", detail: "Across all reviewers" },
  { label: "Storage usage", value: "78%", detail: "1.56 TB of 2 TB" },
] as const;
const tasks = [
  { title: "March launch approvals", status: "Complete" },
  { title: "Partner localization review", status: "Waiting on billing" },
  { title: "Homepage image audit", status: "No matching files" },
] as const;
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="brand-lockup">
        <span class="brand-lockup__badge">SK</span>
        <div>
          <strong>StateKit Demo</strong>
          <p>Vite Vue admin example</p>
        </div>
      </div>
      <nav class="sidebar-nav" aria-label="Primary">
        <a
          v-for="item in navItems"
          :key="item.label"
          href="#"
          class="sidebar-nav__item"
          ><span>{{ item.label }}</span
          ><span>{{ item.count }}</span></a
        >
      </nav>
    </aside>
    <main class="admin-main">
      <section class="hero-strip">
        <div class="hero-strip__copy">
          <p class="eyebrow">Workspace</p>
          <h1>Creative operations control room</h1>
          <p>
            A realistic dashboard surface for validating empty, loading,
            permission, success, and upgrade states.
          </p>
        </div>
      </section>
      <section class="metric-grid">
        <article
          v-for="metric in metrics"
          :key="metric.label"
          class="metric-card"
        >
          <p>{{ metric.label }}</p>
          <strong>{{ metric.value }}</strong
          ><span>{{ metric.detail }}</span>
        </article>
      </section>
      <section class="surface-grid">
        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Asset search</p>
              <h2>No matching results inside a live table region</h2>
            </div>
          </div>
          <div class="table-card">
            <div class="table-card__header">
              <span>Name</span><span>Collection</span><span>Status</span
              ><span>Owner</span>
            </div>
            <EmptySearchState layout="inline" density="compact" />
          </div>
        </article>
        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Release queue</p>
              <h2>Loading works best when the page shape stays visible</h2>
            </div>
          </div>
          <div class="table-card">
            <div class="table-card__header">
              <span>Task</span><span>Operator</span><span>Status</span
              ><span>ETA</span>
            </div>
            <LoadingTableState layout="inline" density="compact" />
          </div>
          <div class="task-list">
            <div v-for="task in tasks" :key="task.title" class="task-row">
              <strong>{{ task.title }}</strong
              ><span>{{ task.status }}</span>
            </div>
          </div>
        </article>
      </section>
      <section class="surface-grid">
        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Billing gate</p>
              <h2>Plan value stays product-grade, not promotional</h2>
            </div>
          </div>
          <UpgradePlanState layout="panel" density="compact" />
        </article>
        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Restricted area</p>
              <h2>Permissions should not look like a crash</h2>
            </div>
          </div>
          <NoPermissionState layout="panel" density="compact" />
        </article>
      </section>
      <section class="surface-card">
        <div class="surface-card__header">
          <div>
            <p class="eyebrow">Task handoff</p>
            <h2>Success blocks keep the workflow moving</h2>
          </div>
        </div>
        <TaskSuccessState layout="panel" density="compact" />
      </section>
    </main>
  </div>
</template>
