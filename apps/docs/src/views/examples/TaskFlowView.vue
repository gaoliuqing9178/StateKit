<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ErrorState,
  LoadingState,
  SuccessState,
} from "@statekit-vue/vue";

const logOpenPending = ref(false);
const logViews = ref(6);
const retryPending = ref(false);
const retriesQueued = ref(2);
const reportOpenCount = ref(3);
const publishSummaryCount = ref(1);

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function openProcessingLog() {
  logOpenPending.value = true;
  await wait(700);
  logViews.value += 1;
  logOpenPending.value = false;
}

async function retryValidation() {
  retryPending.value = true;
  await wait(900);
  retriesQueued.value += 1;
  retryPending.value = false;
}

function openReport() {
  reportOpenCount.value += 1;
}

function openPublishSummary() {
  publishSummaryCount.value += 1;
}

const taskRows = computed(() => [
  {
    title: "Upload source CSV",
    status: "Completed",
    toneClass: "is-success",
  },
  {
    title: "Validate destination fields",
    status: retryPending.value ? "Retrying now" : `Queued ${retriesQueued.value} times`,
    toneClass: "is-warning",
  },
  {
    title: "Publish clean records",
    status: "Waiting for final review",
    toneClass: "",
  },
]);
</script>

<template>
  <section class="page-stack">
    <section class="demo-shell">
      <div class="demo-shell__header">
        <div>
          <p class="demo-kicker">Example</p>
          <h1>Task Flow</h1>
          <p>
            A back-office import run rewritten around the current CTA API:
            custom loading labels, inline retry handlers, anchor-style help
            links, and a completion state that hides its secondary action when a
            single next step is enough.
          </p>
        </div>
        <div class="demo-chip-row" aria-label="Scenario tags">
          <span class="demo-chip">Custom loading label</span>
          <span class="demo-chip">Inline retry</span>
          <span class="demo-chip">Single next action</span>
        </div>
      </div>

      <div class="demo-metric-list">
        <div class="demo-metric-list__row">
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Task log opens</p>
            <strong>{{ logViews }}</strong>
            <p>Updated by the loading state's custom primary action.</p>
          </article>
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Retries queued</p>
            <strong>{{ retriesQueued }}</strong>
            <p>Incremented by the inline error retry action below.</p>
          </article>
          <article class="demo-metric">
            <p class="demo-surface__eyebrow">Reports opened</p>
            <strong>{{ reportOpenCount }}</strong>
            <p>Tracked through the success-state handoff button.</p>
          </article>
        </div>
      </div>

      <div class="demo-grid demo-grid--two">
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Monitor a long-running import without leaving the queue</h2>
              <p>
                The loading preset keeps the process visible and now uses a
                custom primary action with `loadingLabel` so the user sees what
                "busy" means.
              </p>
            </div>
            <span class="demo-badge">LoadingState</span>
          </div>

          <LoadingState
            title="Importing 124 finance records"
            description="The queue stays visible while the system validates the source file and maps each destination field."
            :primary-action="{
              label: 'Open processing log',
              onClick: openProcessingLog,
              loading: logOpenPending,
              loadingLabel: 'Opening processing log...',
            }"
          />
        </article>

        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Retry a failed validation step in place</h2>
              <p>
                This inline error keeps the workflow board visible and uses a
                retry button plus an anchor-style secondary link into the help
                notes below.
              </p>
            </div>
            <span class="demo-badge">ErrorState</span>
          </div>

          <div class="demo-status-list">
            <div
              v-for="row in taskRows"
              :key="row.title"
              class="demo-status-list__row"
            >
              <span>{{ row.title }}</span>
              <span class="demo-status-pill" :class="row.toneClass">
                {{ row.status }}
              </span>
            </div>
          </div>

          <ErrorState
            layout="inline"
            density="compact"
            title="One destination field still needs review"
            description="Retry the validation step here, or jump to the rule notes before asking the finance team to re-export."
            :primary-action="{
              label: 'Retry validation',
              onClick: retryValidation,
              loading: retryPending,
              loadingLabel: 'Retrying validation...',
            }"
            :secondary-action="{
              label: 'Read validation notes',
              href: '#validation-rules',
            }"
          />
        </article>

        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Close the workflow with one clear next move</h2>
              <p>
                The completion view here removes the secondary CTA with `null`
                so the operator has one obvious handoff action.
              </p>
            </div>
            <span class="demo-badge">SuccessState</span>
          </div>

          <SuccessState
            layout="page"
            density="spacious"
            title="Import completed and ready for handoff"
            description="Finance records are clean, approvals are attached, and the next useful move is to open the reconciliation report."
            :primary-action="{
              label: 'Open reconciliation report',
              onClick: openReport,
            }"
            :secondary-action="null"
          />
        </article>

        <article class="demo-surface demo-surface--span-2" id="validation-rules">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Follow-up</p>
              <h2>Publish the verified records and leave a visible paper trail</h2>
              <p>
                This final panel keeps the success message smaller and closer to
                the board once the main task handoff has already been completed.
              </p>
            </div>
            <span class="demo-badge">SuccessState</span>
          </div>

          <div class="demo-panel-stack">
            <SuccessState
              layout="panel"
              title="Verified records are now live"
              description="Open the publish summary or head back to the import board for the next batch."
              :primary-action="{
                label: 'Open publish summary',
                onClick: openPublishSummary,
              }"
              :secondary-action="{
                label: 'Back to queue',
                href: '/examples/task-flow',
              }"
            />

            <ul class="demo-note-list">
              <li>
                Validation note anchor opened from the inline error CTA.
              </li>
              <li>
                Publish summaries opened from this panel: {{ publishSummaryCount }}
              </li>
              <li>
                This smaller success state works after the main `SuccessState`
                has already confirmed the larger workflow handoff.
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
