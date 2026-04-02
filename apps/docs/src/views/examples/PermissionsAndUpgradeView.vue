<script setup lang="ts">
import { computed, ref } from "vue";
import {
  NoPermissionState,
  RoleRestrictedState,
  SessionExpiredState,
  UpgradePlanState,
  UsageLimitState,
} from "@statekit/vue";

const accessRequestPending = ref(false);
const accessRequestsSent = ref(4);
const sessionRefreshPending = ref(false);
const sessionRefreshes = ref(1);
const upgradePending = ref(false);
const billingWorkflowsUnlocked = ref(0);
const usageReportRuns = ref(2);
const adminPingCount = ref(1);

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function requestAccess() {
  accessRequestPending.value = true;
  await wait(950);
  accessRequestsSent.value += 1;
  accessRequestPending.value = false;
}

async function restoreSession() {
  sessionRefreshPending.value = true;
  await wait(850);
  sessionRefreshes.value += 1;
  sessionRefreshPending.value = false;
}

async function openBillingWorkspace() {
  upgradePending.value = true;
  await wait(1100);
  billingWorkflowsUnlocked.value += 1;
  upgradePending.value = false;
}

function exportUsageReport() {
  usageReportRuns.value += 1;
}

function pingAdmin() {
  adminPingCount.value += 1;
}

const reviewNotes = computed(() => [
  {
    title: "Access requests sent",
    status: `${accessRequestsSent.value} total`,
    toneClass: "",
  },
  {
    title: "Session recoveries",
    status: `${sessionRefreshes.value} today`,
    toneClass: "is-warning",
  },
  {
    title: "Usage exports",
    status: `${usageReportRuns.value} reports`,
    toneClass: "is-success",
  },
]);
</script>

<template>
  <section class="page-stack">
    <section class="demo-shell">
      <div class="demo-shell__header">
        <div>
          <p class="demo-kicker">Example</p>
          <h1>Permissions And Upgrade</h1>
          <p>
            A finance workspace rewritten around the current CTA surface:
            request-access actions, session recovery with a loading label,
            upgrade decisions, disabled quota controls, and an inline role
            restriction inside a live review queue.
          </p>
        </div>
        <div class="demo-chip-row" aria-label="Scenario tags">
          <span class="demo-chip">Request access</span>
          <span class="demo-chip">Loading recovery</span>
          <span class="demo-chip">Disabled quota CTA</span>
        </div>
      </div>

      <div class="demo-metric-list">
        <div class="demo-metric-list__row">
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Pending approvals</p>
            <strong>{{ accessRequestsSent }}</strong>
            <p>Updated through the `onClick` request-access button below.</p>
          </article>
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Recovered sessions</p>
            <strong>{{ sessionRefreshes }}</strong>
            <p>SessionExpiredState now demonstrates a custom loading label.</p>
          </article>
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Billing unlocks</p>
            <strong>{{ billingWorkflowsUnlocked }}</strong>
            <p>Tracked when the upgrade CTA finishes its async handoff.</p>
          </article>
        </div>
      </div>

      <div class="demo-grid demo-grid--two">
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Request access to a locked approvals workspace</h2>
              <p>
                This block uses `onClick`, `loading`, and `loadingLabel` on the
                primary action, while the secondary action stays a real link.
              </p>
            </div>
            <span class="demo-badge">NoPermissionState</span>
          </div>

          <NoPermissionState
            title="You cannot open finance approvals yet"
            description="Ask a billing admin for workspace access, or review the approval policy before trying again."
            :primary-action="{
              label: 'Request access',
              onClick: requestAccess,
              loading: accessRequestPending,
              loadingLabel: 'Sending request...',
            }"
            :secondary-action="{
              label: 'Review policy',
              href: '/blocks/no-permission-state',
            }"
          />
        </article>

        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Recover a stale session without implying a crash</h2>
              <p>
                The secondary action is removed with `null`, and the primary
                action explains the async transition with a custom loading label.
              </p>
            </div>
            <span class="demo-badge">SessionExpiredState</span>
          </div>

          <SessionExpiredState
            title="Your approvals session needs a fresh sign-in"
            description="Sign in again to keep editing reviewer assignments and approval thresholds."
            :primary-action="{
              label: 'Sign in again',
              onClick: restoreSession,
              loading: sessionRefreshPending,
              loadingLabel: 'Redirecting to sign in...',
            }"
            :secondary-action="null"
          />
        </article>

        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Gate high-cost approval automation behind a plan decision</h2>
              <p>
                This page surface demonstrates a stronger upgrade moment with a
                busy primary CTA and a secondary link into the related usage
                state.
              </p>
            </div>
            <span class="demo-badge">UpgradePlanState</span>
          </div>

          <UpgradePlanState
            layout="page"
            density="spacious"
            title="Upgrade to unlock approval routing"
            description="Move finance operations to the workflow plan to unlock multi-step approvals, escalation rules, and audit-ready routing."
            :primary-action="{
              label: 'Open billing workspace',
              onClick: openBillingWorkspace,
              loading: upgradePending,
              loadingLabel: 'Opening billing workspace...',
            }"
            :secondary-action="{
              label: 'See quota state',
              href: '/blocks/usage-limit-state',
            }"
          />
        </article>

        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Review checklist</p>
              <h2>Different permission and billing limits inside one workflow</h2>
              <p>
                This section contrasts a disabled quota action with an inline
                role restriction that still lets the rest of the review board
                stay visible.
              </p>
            </div>
            <span class="demo-badge">Usage + role scope</span>
          </div>

          <div class="demo-panel-stack">
            <UsageLimitState
              layout="panel"
              density="compact"
              title="Approval runs are at this month's cap"
              description="The billing owner can export current usage, but increasing the limit is disabled until procurement reopens the budget window."
              :primary-action="{
                label: 'Increase limit',
                disabled: true,
              }"
              :secondary-action="{
                label: 'Export usage report',
                onClick: exportUsageReport,
              }"
            />

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

            <div class="demo-inline-panel">
              <div class="demo-inline-panel__copy">
                <p class="demo-surface__eyebrow">Inline restriction</p>
                <h3>Keep the review queue visible for non-admin operators</h3>
                <p>
                  This inline block shows how permission messaging can live
                  inside the active workflow rather than replacing the whole page.
                </p>
              </div>
              <RoleRestrictedState
                layout="inline"
                density="compact"
                :primary-action="{
                  label: 'Ping admin',
                  onClick: pingAdmin,
                }"
              />
              <p class="demo-inline-panel__note">
                Admin pings sent: {{ adminPingCount }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
