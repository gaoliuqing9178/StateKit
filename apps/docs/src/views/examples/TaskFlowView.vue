<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ???????
 * 2. ???????????????????????????? block ??????
 * 3. ??????????????????????????????????
 */
import {
  InlineErrorState,
  LoadingImportState,
  TaskSuccessState,
} from "@statekit/vue";

const taskRows = [
  {
    title: "Upload source CSV",
    status: "Completed",
    toneClass: "is-success",
  },
  {
    title: "Validate destination fields",
    status: "Needs retry",
    toneClass: "is-warning",
  },
  {
    title: "Publish clean records",
    status: "Waiting",
    toneClass: "",
  },
];
</script>

<template>
  <section class="page-stack">
    <section class="demo-shell">
      <div class="demo-shell__header">
        <div>
          <p class="demo-kicker">Example</p>
          <h1>Task Flow</h1>
          <p>
            A back-office import run that moves from active processing to a
            recoverable inline error and finally into a completion state with a
            clear next action.
          </p>
        </div>
        <div class="demo-chip-row" aria-label="Scenario tags">
          <span class="demo-chip">Import processing</span>
          <span class="demo-chip">Inline recovery</span>
          <span class="demo-chip">Successful handoff</span>
        </div>
      </div>
      <div class="demo-grid demo-grid--two">
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Monitor a long-running import</h2>
              <p>
                This state sits beside the task queue so operators can keep
                context while the system processes a large upload.
              </p>
            </div>
            <span class="demo-badge">Processing</span>
          </div>
          <LoadingImportState />
        </article>
        <article class="demo-surface">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Retry a failed validation step in place</h2>
              <p>
                The issue is isolated to one workflow segment, so an inline
                error keeps the rest of the task board visible.
              </p>
            </div>
            <span class="demo-badge">Inline error</span>
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
          <InlineErrorState layout="inline" density="compact" />
        </article>
        <article class="demo-surface demo-surface--span-2">
          <div class="demo-surface__header">
            <div>
              <p class="demo-surface__eyebrow">Task</p>
              <h2>Close the workflow with a clear next move</h2>
              <p>
                Once the task completes, the result state can expand and guide
                the user toward reviewing outcomes or kicking off the next run.
              </p>
            </div>
            <span class="demo-badge">Success result</span>
          </div>
          <TaskSuccessState layout="page" density="spacious" />
        </article>
      </div>
    </section>
  </section>
</template>
