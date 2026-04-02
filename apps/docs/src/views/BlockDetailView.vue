<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { blockComponentMap } from "../lib/block-components";
import { allBlockDocs, getBlockDocBySlug } from "../lib/block-docs";
import {
  blockActionSnippet,
  blockObjectBindingSnippet,
  blockScriptBindingSnippet,
  blockUsageSnippet,
  stateActionTypeSnippet,
} from "../lib/example-code";

interface DetailFact {
  label: string;
  value: string;
}

interface PropDoc {
  name: string;
  type: string;
  description: string;
  syntax: string[];
  current: string;
}

interface CodeExample {
  title: string;
  description: string;
  code: string;
}

const route = useRoute();

const categoryCustomizationGuide = {
  empty:
    "Rewrite the copy so the user understands what is missing, why the screen is empty, and what they should create or clear next.",
  loading:
    "Keep the title and description procedural. Loading blocks work best when they confirm progress and avoid adding unnecessary secondary actions.",
  error:
    "Use direct recovery language. The title should name the failure plainly, and the primary action should map to the safest retry path.",
  permission:
    "Explain the boundary clearly. Good permission copy says who can act, what is restricted, and whether the user should request access or go back.",
  upgrade:
    "Keep the business message product-shaped. Focus on what unlocks next, not on marketing slogans or generic upsell copy.",
  success:
    "Treat this as a completion checkpoint. Confirm what finished, then make the next meaningful action obvious through the primary button.",
} as const;

const parameterRules = [
  "Use plain attributes for fixed strings and enum values, for example `title=\"...\"`, `tone=\"brand\"`, or `layout=\"panel\"`.",
  "Use `:` bindings whenever the value comes from a variable, `ref`, `computed`, object literal, boolean, or `null`.",
  "In Vue templates, prop names stay kebab-case: `primaryAction` becomes `primary-action`, and `secondaryAction` becomes `secondary-action`.",
  "Leaving `primaryAction` or `secondaryAction` undefined keeps the preset default. Passing `null` removes that default button explicitly.",
  "Put click behavior inside `primaryAction.onClick` or `secondaryAction.onClick`. Do not attach CTA handlers to the block component root.",
] as const;

const actionFieldDocs = [
  {
    name: "label",
    type: "string",
    description:
      "The button text shown to the user. This is the only required action field.",
    syntax: ['label: "Create project"'],
    current: "Required in every action object.",
  },
  {
    name: "href",
    type: "string | undefined",
    description:
      "When present, the action renders as a link instead of a button.",
    syntax: ['href: "/settings/billing"'],
    current: "Optional. Omit it when the action should stay a button.",
  },
  {
    name: "onClick",
    type: "(event: MouseEvent) => void | Promise<void>",
    description:
      "Use this for per-button click logic. It works for both button and link style actions.",
    syntax: ["onClick: handlePrimaryClick"],
    current: "Optional. Add it when the action should trigger local behavior.",
  },
  {
    name: "loading",
    type: "boolean | undefined",
    description:
      "Marks the action as busy. StateKit blocks repeat clicks and link navigation while loading is true.",
    syntax: ["loading: pending"],
    current: "Optional. Consumer state controls it.",
  },
  {
    name: "loadingLabel",
    type: "string | undefined",
    description:
      "Overrides the default loading text so the button can say exactly what is happening.",
    syntax: ['loadingLabel: "Creating project..."'],
    current: 'Falls back to "Working..." when omitted.',
  },
  {
    name: "disabled",
    type: "boolean | undefined",
    description:
      "Disables the action and applies the clearer gray state built into the shared shell.",
    syntax: ["disabled: isLocked"],
    current: "Optional. Use it when the action should be visible but unavailable.",
  },
] as const;

const blockMeta = computed(() =>
  getBlockDocBySlug(String(route.params.slug ?? "")),
);

const blockComponent = computed(() =>
  blockMeta.value ? blockComponentMap[blockMeta.value.componentName] : null,
);

const usageSnippet = computed(() =>
  blockMeta.value ? blockUsageSnippet(blockMeta.value) : "",
);

const scriptBindingSnippet = computed(() =>
  blockMeta.value ? blockScriptBindingSnippet(blockMeta.value) : "",
);

const objectBindingSnippet = computed(() =>
  blockMeta.value ? blockObjectBindingSnippet(blockMeta.value) : "",
);

const actionSnippet = computed(() =>
  blockMeta.value ? blockActionSnippet(blockMeta.value) : "",
);

const defaultActions = computed(() =>
  blockMeta.value
    ? [
        blockMeta.value.defaults.primaryAction,
        blockMeta.value.defaults.secondaryAction,
      ]
        .filter((action): action is NonNullable<typeof action> => Boolean(action))
        .map((action) => action.label)
    : [],
);

const detailFacts = computed<DetailFact[]>(() => {
  const meta = blockMeta.value;

  if (!meta) {
    return [];
  }

  return [
    {
      label: "Use this block when",
      value: meta.summary,
    },
    {
      label: "Default shell",
      value: `${meta.defaults.layout} layout, ${meta.defaults.density} density, ${meta.defaults.tone} tone`,
    },
    {
      label: "Supported layouts",
      value: meta.supportedLayouts.join(", "),
    },
    {
      label: "Default CTA pattern",
      value: defaultActions.value.length
        ? defaultActions.value.join(" + ")
        : "No preset actions. Add one only if the flow needs a clear next step.",
    },
  ];
});

const customizationNotes = computed(() => {
  const meta = blockMeta.value;

  if (!meta) {
    return [];
  }

  return [
    categoryCustomizationGuide[meta.category],
    "Replace `title` first. The heading should describe the exact user moment in your own product vocabulary, not the generic sample copy.",
    "Replace `description` next. Use it to explain the next step, any boundary, or any recovery path the user can take from this screen.",
    defaultActions.value.length
      ? "Keep a preset CTA only if it still matches the product flow. Otherwise replace it with your own `primaryAction` / `secondaryAction`, or pass `null` to remove the default."
      : "This preset ships without a strong CTA pattern. Add a primary action only when your product flow genuinely needs one.",
  ];
});

const propDocs = computed<PropDoc[]>(() => {
  const meta = blockMeta.value;

  if (!meta) {
    return [];
  }

  return [
    {
      name: "title",
      type: "string",
      description:
        "Overrides the preset headline. This is the first prop most teams customize.",
      syntax: ['title="No matching invoices"', ':title="pageTitle"'],
      current: meta.defaults.title,
    },
    {
      name: "description",
      type: "string | undefined",
      description:
        "Overrides or adds the supporting sentence below the title.",
      syntax: [
        'description="Try another keyword or clear your filters."',
        ':description="helperCopy"',
      ],
      current:
        meta.defaults.description ??
        "No preset description. You can omit it or pass one when needed.",
    },
    {
      name: "tone",
      type: "neutral | brand | danger | warning | success",
      description:
        "Changes the visual emphasis and semantic color treatment of the shared shell.",
      syntax: ['tone="brand"', ':tone="currentTone"'],
      current: meta.defaults.tone ?? "neutral",
    },
    {
      name: "density",
      type: "compact | cozy | spacious",
      description:
        "Controls spacing and media scale so the same block can fit inline, panel, or page contexts.",
      syntax: ['density="compact"', ':density="density"'],
      current: meta.defaults.density ?? "cozy",
    },
    {
      name: "layout",
      type: meta.supportedLayouts.join(" | "),
      description:
        "Chooses the layout variant for this preset. Unsupported values fall back to the preset default automatically.",
      syntax: [`layout="${meta.defaults.layout}"`, ':layout="selectedLayout"'],
      current: meta.defaults.layout ?? "panel",
    },
    {
      name: "primaryAction",
      type: "StateAction | null | undefined",
      description:
        "Defines or replaces the main CTA. Pass `null` when you want to hide the preset primary button.",
      syntax: [
        `:primary-action="{ label: '${defaultActions.value[0] ?? "Create item"}', onClick: handlePrimaryClick }"`,
        ':primary-action="primaryAction"',
        ':primary-action="null"',
      ],
      current: meta.defaults.primaryAction
        ? meta.defaults.primaryAction.label
        : "No preset primary action.",
    },
    {
      name: "secondaryAction",
      type: "StateAction | null | undefined",
      description:
        "Defines, replaces, or removes the secondary CTA. Use it for lower-priority alternatives such as go back, compare, or learn more.",
      syntax: [
        `:secondary-action="{ label: '${defaultActions.value[1] ?? "Learn more"}', href: '/docs/installation' }"`,
        ':secondary-action="secondaryAction"',
        ':secondary-action="null"',
      ],
      current: meta.defaults.secondaryAction
        ? meta.defaults.secondaryAction.label
        : "No preset secondary action.",
    },
  ];
});

const parameterExamples = computed<CodeExample[]>(() =>
  blockMeta.value
    ? [
        {
          title: "1. Pass fixed values directly in the template",
          description:
            "Use this form when the block content is static for the page. Strings and enum-like props can be written without `:`.",
          code: usageSnippet.value,
        },
        {
          title: "2. Bind variables from `<script setup>`",
          description:
            "Use `:` for values that come from refs, local constants, or action objects declared in script.",
          code: scriptBindingSnippet.value,
        },
        {
          title: "3. Build one props object and spread it with `v-bind`",
          description:
            "Use this pattern when the page composes the block from computed state, feature flags, or async task status.",
          code: objectBindingSnippet.value,
        },
      ]
    : [],
);

const actionExamples = computed<CodeExample[]>(() =>
  blockMeta.value
    ? [
        {
          title: "StateAction object shape",
          description:
            "Every button or link uses the same shared action object. This is the surface you pass to `primaryAction` and `secondaryAction`.",
          code: stateActionTypeSnippet,
        },
        {
          title: "Click handlers, loading labels, disabled states, and links",
          description:
            "Put CTA logic inside the action object. This example shows `onClick`, `href`, `loading`, `loadingLabel`, and `disabled` together.",
          code: actionSnippet.value,
        },
      ]
    : [],
);

const relatedBlocks = computed(() => {
  const meta = blockMeta.value;
  if (!meta) {
    return [];
  }

  return allBlockDocs
    .filter((item) => item.category === meta.category && item.id !== meta.id)
    .slice(0, 3);
});
</script>

<template>
  <section class="page-stack">
    <template v-if="blockMeta">
      <section class="page-hero page-hero--detail">
        <div>
          <p class="eyebrow">{{ blockMeta.category }} block</p>
          <h1>{{ blockMeta.defaults.title }}</h1>
          <p>{{ blockMeta.summary }}</p>
        </div>

        <div class="page-hero__facts">
          <div class="page-fact">
            <strong>{{ blockMeta.priority }}</strong>
            <span>Priority</span>
          </div>
          <div class="page-fact">
            <strong>{{ blockMeta.defaults.layout }}</strong>
            <span>Default layout</span>
          </div>
          <div class="page-fact">
            <strong>{{ blockMeta.supportedLayouts.length }}</strong>
            <span>Layouts supported</span>
          </div>
        </div>
      </section>

      <section class="detail-layout">
        <article class="detail-preview">
          <div class="detail-preview__header">
            <div>
              <p class="detail-preview__eyebrow">Live preview</p>
              <h2>{{ blockMeta.componentName }}</h2>
            </div>

            <div class="detail-preview__meta">
              <span class="meta-pill">{{ blockMeta.defaults.tone }}</span>
              <span class="meta-pill">{{ blockMeta.defaults.density }}</span>
              <span class="meta-pill">{{ blockMeta.defaults.layout }}</span>
            </div>
          </div>

          <div class="detail-preview__surface">
            <component
              :is="blockComponent"
              :layout="blockMeta.defaults.layout"
              :density="blockMeta.defaults.density"
              :tone="blockMeta.defaults.tone"
            />
          </div>
        </article>

        <div class="detail-info-grid">
          <section class="detail-section">
            <h2>Metadata</h2>
            <dl class="detail-definition-list">
              <div>
                <dt>Slug</dt>
                <dd>{{ blockMeta.slug }}</dd>
              </div>
              <div>
                <dt>Component</dt>
                <dd>{{ blockMeta.componentName }}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{{ blockMeta.priority }}</dd>
              </div>
              <div>
                <dt>Layouts</dt>
                <dd>{{ blockMeta.supportedLayouts.join(", ") }}</dd>
              </div>
            </dl>
          </section>

          <section class="detail-section">
            <h2>Defaults</h2>
            <ul class="detail-bullet-list">
              <li><strong>Tone:</strong> {{ blockMeta.defaults.tone }}</li>
              <li><strong>Density:</strong> {{ blockMeta.defaults.density }}</li>
              <li><strong>Layout:</strong> {{ blockMeta.defaults.layout }}</li>
              <li v-if="defaultActions.length">
                <strong>Default actions:</strong> {{ defaultActions.join(", ") }}
              </li>
            </ul>
          </section>

          <section class="detail-section detail-section--usage">
            <h2>Usage</h2>
            <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
          </section>
        </div>
      </section>

      <section class="section-card section-card--outline">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Guide</p>
            <h2>How to use {{ blockMeta.componentName }}</h2>
          </div>
          <p>
            Every preset block is a Vue component with the same base props.
            Start from this scenario default, then customize only the content,
            layout, and CTA behavior your flow actually needs.
          </p>
        </div>

        <div class="detail-guide-grid">
          <article
            v-for="fact in detailFacts"
            :key="fact.label"
            class="detail-guide-note"
          >
            <span>{{ fact.label }}</span>
            <strong>{{ fact.value }}</strong>
          </article>
        </div>

        <div class="detail-doc-grid">
          <section class="detail-section detail-section--doc">
            <h3>What to customize first</h3>
            <ul class="detail-bullet-list">
              <li v-for="note in customizationNotes" :key="note">{{ note }}</li>
            </ul>
          </section>

          <section class="detail-section detail-section--doc">
            <h3>Quick start example</h3>
            <p>
              This is the fastest way to render the preset. It shows the
              component import, direct prop passing, and the default shell values
              for this block.
            </p>
            <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
          </section>
        </div>
      </section>

      <section class="section-card section-card--outline">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Props</p>
            <h2>How to customize content and pass parameters</h2>
          </div>
          <p>
            The same prop surface works across every preset. The only thing that
            changes between blocks is the default copy, supported layouts, and
            action defaults coming from shared metadata.
          </p>
        </div>

        <div class="detail-prop-grid">
          <article
            v-for="prop in propDocs"
            :key="prop.name"
            class="detail-prop-card"
          >
            <div class="detail-prop-card__top">
              <h3>{{ prop.name }}</h3>
              <span class="meta-pill">{{ prop.type }}</span>
            </div>
            <p>{{ prop.description }}</p>
            <div class="detail-prop-card__group">
              <strong>Pass it as</strong>
              <ul class="detail-inline-code-list">
                <li v-for="syntax in prop.syntax" :key="syntax">
                  <code>{{ syntax }}</code>
                </li>
              </ul>
            </div>
            <p class="detail-prop-card__hint">
              <strong>Current default:</strong> {{ prop.current }}
            </p>
          </article>
        </div>

        <div class="detail-doc-grid">
          <section
            v-for="example in parameterExamples"
            :key="example.title"
            class="detail-section detail-section--doc"
          >
            <h3>{{ example.title }}</h3>
            <p>{{ example.description }}</p>
            <pre class="code-block"><code>{{ example.code }}</code></pre>
          </section>
        </div>
      </section>

      <section class="section-card section-card--outline">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Actions</p>
            <h2>Buttons, links, loading, and click events</h2>
          </div>
          <p>
            `primaryAction` and `secondaryAction` are where CTA behavior lives.
            Use them to define button labels, link targets, disabled state,
            loading state, and click handlers for this block.
          </p>
        </div>

        <div class="detail-doc-grid">
          <section
            v-for="example in actionExamples"
            :key="example.title"
            class="detail-section detail-section--doc"
          >
            <h3>{{ example.title }}</h3>
            <p>{{ example.description }}</p>
            <pre class="code-block"><code>{{ example.code }}</code></pre>
          </section>
        </div>

        <div class="detail-prop-grid detail-prop-grid--compact">
          <article
            v-for="field in actionFieldDocs"
            :key="field.name"
            class="detail-prop-card detail-prop-card--compact"
          >
            <div class="detail-prop-card__top">
              <h3>{{ field.name }}</h3>
              <span class="meta-pill">{{ field.type }}</span>
            </div>
            <p>{{ field.description }}</p>
            <div class="detail-prop-card__group">
              <strong>Typical value</strong>
              <ul class="detail-inline-code-list">
                <li v-for="syntax in field.syntax" :key="syntax">
                  <code>{{ syntax }}</code>
                </li>
              </ul>
            </div>
            <p class="detail-prop-card__hint">
              <strong>Note:</strong> {{ field.current }}
            </p>
          </article>
        </div>

        <section class="detail-section detail-section--doc detail-section--full">
          <h3>Passing rules that matter</h3>
          <ol class="plain-list">
            <li v-for="rule in parameterRules" :key="rule">{{ rule }}</li>
          </ol>
        </section>
      </section>

      <section
        v-if="relatedBlocks.length"
        class="section-card section-card--outline"
      >
        <div class="section-heading">
          <div>
            <p class="eyebrow">Related</p>
            <h2>More blocks in the same category</h2>
          </div>
          <p>
            Use these when the moment changes but the user still expects the
            same semantic family.
          </p>
        </div>

        <div class="related-grid">
          <RouterLink
            v-for="item in relatedBlocks"
            :key="item.id"
            class="editorial-link"
            :to="'/blocks/' + item.slug"
          >
            <span class="editorial-link__index">{{ item.category }}</span>
            <div>
              <h3>{{ item.defaults.title }}</h3>
              <p>{{ item.summary }}</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </template>

    <section v-else class="section-card section-card--empty">
      <p class="eyebrow">Missing</p>
      <h1>Block not found</h1>
      <p>The requested slug does not match any block in the shared metadata.</p>
    </section>
  </section>
</template>
