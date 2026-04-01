<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ?????????
 * 2. ????????????????????????????????
 * 3. ??????????????????????????????
 */
import {
  EmptyCollectionState,
  EmptySearchState,
  FirstProjectState,
} from "@statekit/vue";

const setupChecks = [
  "Search stays inline so the surrounding table structure remains visible.",
  "Collection creation sits in a panel because it belongs to the content region, not the whole screen.",
  "First-run onboarding escalates to a page layout because the workspace needs a new decision before work can start.",
];
</script>

<template>
  <section class="page-stack">
    <section class="demo-shell">
      <div class="demo-shell__header">
        <div>
          <p class="demo-kicker">Example</p>
          <h1>Admin Empty States</h1>
          <p>
            A content operations workspace where the team is setting up a new
            asset library, checking filtered results, and guiding first-run
            users into their first project.
          </p>
        </div>
        <div class="demo-chip-row" aria-label="Scenario tags">
          <span class="demo-chip">Asset search</span>
          <span class="demo-chip">Collection setup</span>
          <span class="demo-chip">First-run onboarding</span>
        </div>
      </div>
      <div class="demo-grid demo-grid--two">
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Review filtered assets before a launch</h2>
              <p>
                The operator narrowed a large media library to one campaign.
                The table context should remain visible even when the result set
                is empty.
              </p>
            </div>
            <span class="demo-badge">Inline empty</span>
          </div>
          <div class="demo-toolbar">
            <div class="demo-toolbar__search">Search "spring launch banner"</div>
            <div class="demo-toolbar__button">Clear filters</div>
          </div>
          <div class="demo-table">
            <div class="demo-table__head">
              <span>Name</span>
              <span>Collection</span>
              <span>Status</span>
              <span>Owner</span>
            </div>
            <EmptySearchState layout="inline" density="compact" />
          </div>
        </article>
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Create the first shared collection</h2>
              <p>
                This state belongs in the main content area. It should help the
                team start without pretending the whole product is blocked.
              </p>
            </div>
            <span class="demo-badge">Panel empty</span>
          </div>
          <div class="demo-status-list">
            <div class="demo-status-list__row">
              <span>Collections connected</span>
              <span class="demo-status-pill">0 active</span>
            </div>
            <div class="demo-status-list__row">
              <span>Import jobs waiting</span>
              <span class="demo-status-pill is-warning">Needs setup</span>
            </div>
          </div>
          <EmptyCollectionState layout="panel" />
        </article>
        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Guide a new workspace into its first project</h2>
              <p>
                First-run onboarding needs stronger focus, wider spacing, and a
                clearer primary action because it is the next meaningful product
                decision.
              </p>
            </div>
            <span class="demo-badge">Page empty</span>
          </div>
          <FirstProjectState layout="page" density="spacious" />
          <ul class="demo-note-list">
            <li v-for="item in setupChecks" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
  </section>
</template>
