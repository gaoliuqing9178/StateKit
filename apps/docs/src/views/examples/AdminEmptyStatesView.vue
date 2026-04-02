<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EmptyCollectionState,
  EmptySearchState,
  FirstProjectState,
} from "@statekit/vue";

const activeFilters = ref([
  "Campaign: Spring relaunch",
  "Owner: Brand studio",
  "Status: Needs review",
]);
const searchActionNote = ref(
  "Use the primary action to clear filters. The secondary action stays a real link so the operator can jump straight into content creation.",
);
const collectionPending = ref(false);
const collectionDrafts = ref(0);
const collectionActionNote = ref(
  "This surface intentionally uses a single primary CTA. The preset secondary action is removed with `null`.",
);
const onboardingPending = ref(false);
const onboardingRuns = ref(0);

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function clearFilters() {
  activeFilters.value = [];
  searchActionNote.value =
    "Filters cleared. The inline state keeps the table frame visible, and the clear-filters CTA is now disabled because there is nothing left to reset.";
}

function saveEmptyView() {
  searchActionNote.value =
    "Saved the current empty result as a reusable review view for the content team.";
}

async function createCollectionDraft() {
  collectionPending.value = true;
  collectionActionNote.value = "Creating a starter collection for the launch team...";
  await wait(950);
  collectionDrafts.value += 1;
  collectionPending.value = false;
  collectionActionNote.value =
    "Starter collection created. The page keeps the empty state visible here so the docs page can continue demonstrating the single-CTA pattern.";
}

async function startWorkspaceSetup() {
  onboardingPending.value = true;
  await wait(1200);
  onboardingRuns.value += 1;
  onboardingPending.value = false;
}

const searchPrimaryAction = computed(() =>
  activeFilters.value.length
    ? { label: "Clear filters", onClick: clearFilters }
    : { label: "Filters cleared", disabled: true },
);

const searchSecondaryAction = computed(() => ({
  label: "Save empty view",
  onClick: saveEmptyView,
}));

const adminMetrics = computed(() => [
  {
    label: "Active filters",
    value: String(activeFilters.value.length),
    detail: "Live search constraints inside the asset table",
  },
  {
    label: "Draft collections",
    value: String(collectionDrafts.value),
    detail: "Created from the panel CTA in this example",
  },
  {
    label: "Setup runs",
    value: String(onboardingRuns.value),
    detail: "Workspace onboarding actions triggered here",
  },
]);

const setupChecks = computed(() => [
  "Inline empty states work best when the surrounding table chrome still matters.",
  "Panel empty states can hide their preset secondary CTA by passing `:secondary-action=\"null\"`.",
  "First-run onboarding benefits from a wide page layout plus a loading label that explains what the primary CTA is doing.",
]);
</script>

<template>
  <section class="page-stack">
    <section class="demo-shell">
      <div class="demo-shell__header">
        <div>
          <p class="demo-kicker">Example</p>
          <h1>Admin Empty States</h1>
          <p>
            A content operations workspace rewritten around the current block
            API: inline recovery for empty search results, a single-CTA
            collection setup flow, and a first-run onboarding page with a real
            loading button.
          </p>
        </div>
        <div class="demo-chip-row" aria-label="Scenario tags">
          <span class="demo-chip">Inline recovery</span>
          <span class="demo-chip">Single CTA with null</span>
          <span class="demo-chip">Loading label</span>
        </div>
      </div>

      <div class="demo-metric-list">
        <div class="demo-metric-list__row">
          <article
            v-for="metric in adminMetrics"
            :key="metric.label"
            class="demo-metric"
          >
            <p class="demo-surface__eyebrow">{{ metric.label }}</p>
            <strong>{{ metric.value }}</strong>
            <p>{{ metric.detail }}</p>
          </article>
        </div>
      </div>

      <div class="demo-grid demo-grid--two">
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Keep the asset table visible during an empty search</h2>
              <p>
                This example shows an inline empty state with a real `onClick`
                handler, a disabled state after filters are cleared, and a
                secondary action that remains actionable.
              </p>
            </div>
            <span class="demo-badge">EmptySearchState</span>
          </div>

          <div class="demo-toolbar">
            <div class="demo-toolbar__search">Search "spring relaunch / hero"</div>
            <div class="demo-filter-row">
              <span
                v-for="filter in activeFilters"
                :key="filter"
                class="demo-filter-tag"
              >
                {{ filter }}
              </span>
              <span v-if="!activeFilters.length" class="demo-filter-tag is-muted">
                No active filters
              </span>
            </div>
          </div>

          <div class="demo-table">
            <div class="demo-table__head">
              <span>Name</span>
              <span>Collection</span>
              <span>Status</span>
              <span>Owner</span>
            </div>
            <EmptySearchState
              layout="inline"
              density="compact"
              title="No approved hero assets match this review"
              description="Clear the campaign filters or save this empty result as a reusable review view."
              :primary-action="searchPrimaryAction"
              :secondary-action="searchSecondaryAction"
            />
          </div>

          <ul class="demo-note-list">
            <li>{{ searchActionNote }}</li>
            <li>
              `title` and `description` are customized here, while the layout
              stays `inline` so the operator never loses table context.
            </li>
          </ul>
        </article>

        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Create the first shared collection with one clear action</h2>
              <p>
                This panel demonstrates the current CTA API directly: custom
                button text, `onClick`, `loading`, `loadingLabel`, and explicit
                removal of the preset secondary action.
              </p>
            </div>
            <span class="demo-badge">EmptyCollectionState</span>
          </div>

          <div class="demo-status-list">
            <div class="demo-status-list__row">
              <span>Collections connected</span>
              <span class="demo-status-pill">{{ collectionDrafts }} draft</span>
            </div>
            <div class="demo-status-list__row">
              <span>Import connectors</span>
              <span class="demo-status-pill is-warning">Needs setup</span>
            </div>
          </div>

          <EmptyCollectionState
            layout="panel"
            title="No shared launch library yet"
            description="Create one collection first, then invite content owners to upload approved assets."
            :primary-action="{
              label: 'Create collection',
              onClick: createCollectionDraft,
              loading: collectionPending,
              loadingLabel: 'Creating collection...',
            }"
            :secondary-action="null"
          />

          <ul class="demo-note-list">
            <li>{{ collectionActionNote }}</li>
          </ul>
        </article>

        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Use the first-run preset as a true onboarding decision point</h2>
              <p>
                This page layout keeps the first action large and explicit. The
                primary CTA uses a custom loading label, while the secondary CTA
                remains a real link into the setup guide.
              </p>
            </div>
            <span class="demo-badge">FirstProjectState</span>
          </div>

          <FirstProjectState
            layout="page"
            density="spacious"
            title="Open the workspace with one launch stream"
            description="Create the first project, connect owners, and give reviewers a single place to approve assets."
            :primary-action="{
              label: 'Start workspace setup',
              onClick: startWorkspaceSetup,
              loading: onboardingPending,
              loadingLabel: 'Preparing workspace...',
            }"
            :secondary-action="{
              label: 'Read setup checklist',
              href: '/docs/installation',
            }"
          />

          <ul class="demo-note-list">
            <li v-for="item in setupChecks" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
  </section>
</template>
