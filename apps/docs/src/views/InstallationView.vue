<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  installSnippet,
  minimalUsageSnippet,
  stylesheetSnippet,
} from "../lib/example-code";
import { installationSteps } from "../lib/copy";

const installSections = [
  {
    index: "01",
    title: "Add the package",
    description:
      "Install the Vue package in the consuming Vue 3.4+ workspace where the state blocks will render.",
    code: installSnippet,
  },
  {
    index: "02",
    title: "Import the shared stylesheet",
    description:
      "Pull in the default StateKit styles once in your app entry or page shell so every preset block keeps the same shell and tone system.",
    code: stylesheetSnippet,
  },
  {
    index: "03",
    title: "Render one preset and override the copy",
    description:
      "After the stylesheet is in place, import one preset component and change only the title, description, and CTA content that matters to the product flow.",
    code: minimalUsageSnippet,
  },
];

const overrideOptions = [
  "Title and description copy",
  "Tone, density, and layout",
  "Primary and secondary CTA labels",
];

const consistencyNotes = [
  "Shared metadata drives the default tone, density, layout, and action structure.",
  "Every block keeps the same underlying API so teams can switch presets without relearning the surface.",
  "The standard UI install only needs `@statekit-vue/vue`; add `@statekit-vue/shared` only for metadata and shared types.",
];
</script>

<template>
  <section class="page-stack">
    <section class="page-hero">
      <div>
        <p class="eyebrow">Installation</p>
        <h1>Start with one preset, then change only the product language.</h1>
        <p>
          StateKit is meant to be low-decision: one package, one stylesheet, and
          a small set of high-value props on top of shared defaults.
        </p>
      </div>

      <div class="page-hero__facts">
        <div class="page-fact">
          <strong>01</strong>
          <span>Package</span>
        </div>
        <div class="page-fact">
          <strong>02</strong>
          <span>Stylesheet</span>
        </div>
        <div class="page-fact">
          <strong>03</strong>
          <span>Setup steps</span>
        </div>
      </div>
    </section>

    <section class="install-layout">
      <div class="install-steps">
        <article
          v-for="section in installSections"
          :key="section.index"
          class="install-step"
        >
          <span class="install-step__index">{{ section.index }}</span>
          <div class="install-step__body">
            <div class="install-step__copy">
              <h2>{{ section.title }}</h2>
              <p>{{ section.description }}</p>
            </div>
            <pre class="code-block"><code>{{ section.code }}</code></pre>
          </div>
        </article>
      </div>

      <aside class="install-sidebar">
        <section class="detail-section">
          <h2>What you customize</h2>
          <ul class="detail-bullet-list">
            <li v-for="item in overrideOptions" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2>What stays consistent</h2>
          <ul class="detail-bullet-list">
            <li v-for="item in consistencyNotes" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2>Implementation checklist</h2>
          <ol class="plain-list">
            <li v-for="step in installationSteps" :key="step">{{ step }}</li>
          </ol>
        </section>

        <RouterLink class="button-link" to="/blocks">Browse all blocks</RouterLink>
      </aside>
    </section>
  </section>
</template>
