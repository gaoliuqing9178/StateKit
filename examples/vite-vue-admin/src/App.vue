<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EmptySearchState,
  LoadingTableState,
  NoPermissionState,
  PublishSuccessState,
  UpgradePlanState,
} from "@statekit/vue";

const navItems = [
  { label: "Overview", count: "12", active: true },
  { label: "Campaigns", count: "08", active: false },
  { label: "Assets", count: "214", active: false },
  { label: "Automation", count: "05", active: false },
] as const;

const searchFilters = ref([
  "Campaign: Spring relaunch",
  "Type: Hero image",
]);
const savedViews = ref(3);
const accessRequests = ref(2);
const billingEscalations = ref(1);
const publishSummaries = ref(5);
const accessPending = ref(false);
const billingPending = ref(false);

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function clearFilters() {
  searchFilters.value = [];
}

function saveEmptyView() {
  savedViews.value += 1;
}

async function requestAccess() {
  accessPending.value = true;
  await wait(850);
  accessRequests.value += 1;
  accessPending.value = false;
}

async function openBillingUpgrade() {
  billingPending.value = true;
  await wait(1050);
  billingEscalations.value += 1;
  billingPending.value = false;
}

function openPublishSummary() {
  publishSummaries.value += 1;
}

const metrics = computed(() => [
  {
    label: "Saved empty views",
    value: String(savedViews.value),
    detail: "Updated by the inline empty-state secondary action",
  },
  {
    label: "Access requests",
    value: String(accessRequests.value),
    detail: "Triggered by the permission-state request CTA",
  },
  {
    label: "Billing escalations",
    value: String(billingEscalations.value),
    detail: "Tracked when the upgrade CTA completes",
  },
]);

const searchPrimaryAction = computed(() =>
  searchFilters.value.length
    ? { label: "Clear filters", onClick: clearFilters }
    : { label: "Filters cleared", disabled: true },
);
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="brand-lockup">
        <span class="brand-lockup__badge">SK</span>
        <div>
          <strong>StateKit Demo</strong>
          <p>External admin consumer</p>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Primary">
        <a
          v-for="item in navItems"
          :key="item.label"
          href="#"
          class="sidebar-nav__item"
          :class="{ 'is-active': item.active }"
        >
          <span>{{ item.label }}</span>
          <span>{{ item.count }}</span>
        </a>
      </nav>
    </aside>

    <main class="admin-main">
      <section class="hero-strip">
        <div class="hero-strip__copy">
          <p class="eyebrow">Workspace</p>
          <h1>Creative operations control room</h1>
          <p>
            A realistic external consumer page showing how StateKit blocks adapt
            to empty, loading, permission, upgrade, and success moments with the
            current CTA API.
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
          <strong>{{ metric.value }}</strong>
          <span>{{ metric.detail }}</span>
        </article>
      </section>

      <section class="surface-grid">
        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Asset search</p>
              <h2>Empty search results stay inside the live table</h2>
              <p>
                The clear-filters button uses `onClick`, and the secondary CTA
                saves the current empty view as a reusable workspace filter.
              </p>
            </div>
            <span class="status-chip">EmptySearchState</span>
          </div>

          <div class="table-card">
            <div class="table-card__header">
              <span>Name</span>
              <span>Collection</span>
              <span>Status</span>
              <span>Owner</span>
            </div>
            <EmptySearchState
              layout="inline"
              density="compact"
              title="No approved hero assets match this review"
              description="Clear the current filters or save this empty result as a reusable view."
              :primary-action="searchPrimaryAction"
              :secondary-action="{
                label: 'Save empty view',
                onClick: saveEmptyView,
              }"
            />
          </div>

          <ul class="surface-note-list">
            <li
              v-for="filter in searchFilters"
              :key="filter"
              class="surface-note-list__item"
            >
              {{ filter }}
            </li>
            <li v-if="!searchFilters.length" class="surface-note-list__item is-muted">
              No active filters remain, so the primary CTA is disabled.
            </li>
          </ul>
        </article>

        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Release queue</p>
              <h2>Loading keeps the queue structure visible</h2>
              <p>
                This uses the compact inline loading preset with customized copy
                for a real publishing queue.
              </p>
            </div>
            <span class="status-chip">LoadingTableState</span>
          </div>

          <div class="table-card">
            <div class="table-card__header">
              <span>Task</span>
              <span>Operator</span>
              <span>Status</span>
              <span>ETA</span>
            </div>
            <LoadingTableState
              layout="inline"
              density="compact"
              title="Loading release queue"
              description="Refreshing review tasks and publish timings for the next campaign wave."
            />
          </div>
        </article>
      </section>

      <section class="surface-grid">
        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Billing gate</p>
              <h2>Upgrade decisions stay product-shaped</h2>
              <p>
                The primary CTA uses `loadingLabel`, while the secondary CTA is
                a link into the broader billing workflow.
              </p>
            </div>
            <span class="status-chip">UpgradePlanState</span>
          </div>

          <UpgradePlanState
            layout="panel"
            density="compact"
            title="Upgrade to unlock approval routing"
            description="Move this workspace to the workflow plan to enable approval chains and audit-ready automation."
            :primary-action="{
              label: 'Open billing workspace',
              onClick: openBillingUpgrade,
              loading: billingPending,
              loadingLabel: 'Opening billing workspace...',
            }"
            :secondary-action="{
              label: 'Review billing policy',
              href: '#billing-policy',
            }"
          />

          <p id="billing-policy" class="surface-footnote">
            Billing policy note: this workspace needs the workflow plan before
            approval routing and audit automation can be enabled.
          </p>
        </article>

        <article class="surface-card">
          <div class="surface-card__header">
            <div>
              <p class="eyebrow">Restricted area</p>
              <h2>Permission states explain the boundary, not a crash</h2>
              <p>
                This panel uses a request-access CTA with async feedback and
                hides the secondary button to keep one clear next step.
              </p>
            </div>
            <span class="status-chip">NoPermissionState</span>
          </div>

          <NoPermissionState
            layout="panel"
            density="compact"
            title="You need workspace approval"
            description="Ask a finance admin for access before editing payout approvals in this area."
            :primary-action="{
              label: 'Request access',
              onClick: requestAccess,
              loading: accessPending,
              loadingLabel: 'Sending request...',
            }"
            :secondary-action="null"
          />
        </article>
      </section>

      <section class="surface-card">
        <div class="surface-card__header">
          <div>
            <p class="eyebrow">Publishing handoff</p>
            <h2>Success states keep the operator moving</h2>
            <p>
              This example uses a single follow-up action to open the publish
              summary after the release has already gone live.
            </p>
          </div>
          <span class="status-chip">PublishSuccessState</span>
        </div>

        <PublishSuccessState
          layout="panel"
          density="compact"
          title="Campaign bundle is live"
          description="Review the final publish summary or move straight into the next release wave."
          :primary-action="{
            label: 'Open publish summary',
            onClick: openPublishSummary,
          }"
          :secondary-action="null"
        />

        <p class="surface-footnote">
          Publish summaries opened from this page: {{ publishSummaries }}
        </p>
      </section>
    </main>
  </div>
</template>
