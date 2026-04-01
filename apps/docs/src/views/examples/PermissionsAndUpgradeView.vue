<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ?????????
 * 2. ???????????????????????????????
 * 3. ??????????CTA ????????????????????
 */
import {
  NoPermissionState,
  SessionExpiredState,
  UpgradePlanState,
  UsageLimitState,
} from "@statekit/vue";

const reviewNotes = [
  {
    title: "Workspace permissions",
    status: "Requires admin approval",
    toneClass: "",
  },
  {
    title: "Session recovery",
    status: "Re-authentication needed",
    toneClass: "is-warning",
  },
  {
    title: "Billing guardrail",
    status: "Feature gated by plan",
    toneClass: "is-success",
  },
];
</script>

<template>
  <section class="page-stack">
    <section class="demo-shell">
      <div class="demo-shell__header">
        <div>
          <p class="demo-kicker">Example</p>
          <h1>Permissions And Upgrade</h1>
          <p>
            A finance workspace where one teammate requests access, another
            returns after a stale session, and the billing owner hits a plan
            gate while scaling usage.
          </p>
        </div>
        <div class="demo-chip-row" aria-label="Scenario tags">
          <span class="demo-chip">Restricted workspace</span>
          <span class="demo-chip">Expired session</span>
          <span class="demo-chip">Plan upgrade</span>
        </div>
      </div>
      <div class="demo-metric-list">
        <div class="demo-metric-list__row">
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Pending approvals</p>
            <strong>04</strong>
            <p>Requests waiting on finance admins today.</p>
          </article>
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Seats in use</p>
            <strong>28 / 30</strong>
            <p>Teams are close to the current subscription limit.</p>
          </article>
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Critical actions</p>
            <strong>03</strong>
            <p>Billing, approval, and access recovery all need clear states.</p>
          </article>
        </div>
      </div>
      <div class="demo-grid demo-grid--two">
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Open a locked financial workspace</h2>
              <p>
                This page is available in the navigation, but the current user
                cannot access the underlying resource.
              </p>
            </div>
            <span class="demo-badge">Permission gate</span>
          </div>
          <NoPermissionState />
        </article>
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Resume editing after a session timeout</h2>
              <p>
                The user can return, but only after signing in again. The tone
                should warn, not imply a system crash.
              </p>
            </div>
            <span class="demo-badge">Session recovery</span>
          </div>
          <SessionExpiredState />
        </article>
        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Unlock approvals and quota-heavy automation</h2>
              <p>
                The billing owner needs a stronger upgrade surface because the
                next step changes the plan, budget, and available workflows.
              </p>
            </div>
            <span class="demo-badge">Upgrade decision</span>
          </div>
          <UpgradePlanState layout="page" density="spacious" />
        </article>
        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Review checklist</p>
              <h2>How these states differ inside the same product area</h2>
            </div>
          </div>
          <div class="demo-panel-stack">
            <UsageLimitState />
            <div class="demo-status-list">
              <div
                v-for="note in reviewNotes"
                :key="note.title"
                class="demo-status-list__row"
              >
                <span>{{ note.title }}</span>
                <span class="demo-status-pill" :class="note.toneClass">
                  {{ note.status }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
