<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { recipeComponentMap } from "../lib/recipe-components";
import { allRecipeDocs, getRecipeDocBySlug } from "../lib/recipe-docs";
import {
  recipeActionSnippet,
  recipeObjectBindingSnippet,
  recipeScriptBindingSnippet,
  recipeUsageSnippet,
  stateActionTypeSnippet,
} from "../lib/example-code";
import {
  actionFieldDocs,
  onboardingSlotDocs,
  parameterRules,
  recipeDetailCopy,
  type CodeExample,
  type DetailFact,
  type PropDoc,
} from "../lib/detail-copy";
import {
  getCategoryCustomizationGuide,
  getCategoryLabel,
} from "../lib/category-docs";
import { useLocale } from "../lib/i18n";
import { getRecipeCopy } from "../lib/recipe-i18n";

const route = useRoute();
const { locale, routePath } = useLocale();
const copy = computed(() => recipeDetailCopy[locale.value]);

const recipeMeta = computed(() =>
  getRecipeDocBySlug(String(route.params.slug ?? "")),
);

const localizedRecipe = computed(() =>
  recipeMeta.value ? getRecipeCopy(recipeMeta.value, locale.value) : null,
);

const categoryLabel = computed(() =>
  recipeMeta.value ? getCategoryLabel(locale.value, recipeMeta.value.category) : "",
);

const recipeComponent = computed(() =>
  recipeMeta.value ? recipeComponentMap[recipeMeta.value.componentName] : null,
);

const snippetMeta = computed(() =>
  recipeMeta.value && localizedRecipe.value
    ? {
        ...recipeMeta.value,
        summary: localizedRecipe.value.summary,
        defaults: localizedRecipe.value.defaults,
      }
    : null,
);

const usageSnippet = computed(() =>
  snippetMeta.value ? recipeUsageSnippet(snippetMeta.value) : "",
);

const scriptBindingSnippet = computed(() =>
  snippetMeta.value ? recipeScriptBindingSnippet(snippetMeta.value) : "",
);

const objectBindingSnippet = computed(() =>
  snippetMeta.value ? recipeObjectBindingSnippet(snippetMeta.value) : "",
);

const actionSnippet = computed(() =>
  snippetMeta.value
    ? recipeActionSnippet(snippetMeta.value).replace(
        "href: '/docs/installation'",
        locale.value === "zh-CN"
          ? "href: '/zh-CN/docs/installation'"
          : "href: '/docs/installation'",
      )
    : "",
);

const defaultActionLabels = computed(() =>
  localizedRecipe.value
    ? [
        localizedRecipe.value.defaults.primaryAction,
        localizedRecipe.value.defaults.secondaryAction,
      ]
        .filter((action): action is NonNullable<typeof action> => Boolean(action))
        .map((action) => action.label)
    : [],
);

const detailFacts = computed<DetailFact[]>(() => {
  const meta = recipeMeta.value;
  const localized = localizedRecipe.value;

  if (!meta || !localized) {
    return [];
  }

  const noActions =
    locale.value === "en"
      ? "No preset actions. Add one only if the flow needs a clear next step."
      : "没有预设 action。只有流程真的需要明确下一步时，再添加主操作。";

  return [
    {
      label: locale.value === "en" ? "Use this recipe when" : "适用场景",
      value: localized.summary,
    },
    {
      label: locale.value === "en" ? "Default shell" : "默认壳层",
      value:
        locale.value === "en"
          ? `${localized.defaults.layout} layout, ${localized.defaults.density} density, ${localized.defaults.tone} tone`
          : `${localized.defaults.layout} 布局、${localized.defaults.density} 密度、${localized.defaults.tone} 语气`,
    },
    {
      label: locale.value === "en" ? "Supported layouts" : "支持布局",
      value: meta.supportedLayouts.join(", "),
    },
    {
      label: locale.value === "en" ? "Default CTA pattern" : "默认 CTA 模式",
      value: defaultActionLabels.value.length
        ? defaultActionLabels.value.join(" + ")
        : noActions,
    },
  ];
});

const customizationNotes = computed(() => {
  const meta = recipeMeta.value;

  if (!meta) {
    return [];
  }

  if (locale.value === "zh-CN") {
    return [
      getCategoryCustomizationGuide(locale.value, meta.category),
      "先替换 `title`。标题应该描述你产品里的真实用户时刻，而不是停留在通用示例文案。",
      "再替换 `description`。用它说明下一步、边界条件，或用户可以从当前界面采取的恢复路径。",
      defaultActionLabels.value.length
        ? "只有 preset CTA 仍然符合当前产品流程时才保留。否则换成你自己的 `primaryAction` / `secondaryAction`，或者传 `null` 明确移除默认按钮。"
        : "这个 preset 没有强 CTA 默认模式。只有产品流程真的需要时，再添加 primary action。",
    ];
  }

  return [
    getCategoryCustomizationGuide(locale.value, meta.category),
    "Replace `title` first. The heading should describe the exact user moment in your own product vocabulary, not the generic sample copy.",
    "Replace `description` next. Use it to explain the next step, any boundary, or any recovery path the user can take from this screen.",
    defaultActionLabels.value.length
      ? "Keep a preset CTA only if it still matches the product flow. Otherwise replace it with your own `primaryAction` / `secondaryAction`, or pass `null` to remove the default."
      : "This preset ships without a strong CTA pattern. Add a primary action only when your product flow genuinely needs one.",
  ];
});

const propDocs = computed<PropDoc[]>(() => {
  const meta = recipeMeta.value;
  const localized = localizedRecipe.value;

  if (!meta || !localized) {
    return [];
  }

  if (locale.value === "zh-CN") {
    return [
      {
        name: "title",
        type: "string",
        description: "覆盖 preset 默认标题。这通常是团队最先改的 prop。",
        syntax: ['title="没有匹配的发票"', ':title="pageTitle"'],
        current: localized.defaults.title,
      },
      {
        name: "description",
        type: "string | undefined",
        description: "覆盖或补充标题下方的辅助说明。",
        syntax: [
          'description="换一个关键词，或清除当前筛选条件。"',
          ':description="helperCopy"',
        ],
        current:
          localized.defaults.description ??
          "没有 preset 描述。你可以省略它，也可以按需要传入。",
      },
      {
        name: "tone",
        type: "neutral | brand | danger | warning | success",
        description: "改变 shared shell 的视觉强调和语义色处理。",
        syntax: ['tone="brand"', ':tone="currentTone"'],
        current: localized.defaults.tone ?? "neutral",
      },
      {
        name: "density",
        type: "compact | cozy | spacious",
        description:
          "控制间距和媒体尺寸，让同一个类别入口可以放进 inline、panel 或 page 场景。",
        syntax: ['density="compact"', ':density="density"'],
        current: localized.defaults.density ?? "cozy",
      },
      {
        name: "layout",
        type: meta.supportedLayouts.join(" | "),
        description:
          "选择当前 preset 的布局变体。不支持的值会自动回退到 preset 默认布局。",
        syntax: [
          `layout="${localized.defaults.layout}"`,
          ':layout="selectedLayout"',
        ],
        current: localized.defaults.layout ?? "panel",
      },
      {
        name: "primaryAction",
        type: "StateAction | null | undefined",
        description:
          "定义或替换主 CTA。传 `null` 时会明确隐藏 preset 默认主按钮。",
        syntax: [
          `:primary-action="{ label: '${defaultActionLabels.value[0] ?? "创建条目"}', onClick: handlePrimaryClick }"`,
          ':primary-action="primaryAction"',
          ':primary-action="null"',
        ],
        current: localized.defaults.primaryAction
          ? localized.defaults.primaryAction.label
          : "没有 preset 主操作。",
      },
      {
        name: "secondaryAction",
        type: "StateAction | null | undefined",
        description:
          "定义、替换或移除次 CTA。适合返回、对比、了解更多这类低优先级替代动作。",
        syntax: [
          `:secondary-action="{ label: '${defaultActionLabels.value[1] ?? "了解更多"}', href: '/zh-CN/docs/installation' }"`,
          ':secondary-action="secondaryAction"',
          ':secondary-action="null"',
        ],
        current: localized.defaults.secondaryAction
          ? localized.defaults.secondaryAction.label
          : "没有 preset 次操作。",
      },
    ];
  }

  return [
    {
      name: "title",
      type: "string",
      description:
        "Overrides the preset headline. This is the first prop most teams customize.",
      syntax: ['title="No matching invoices"', ':title="pageTitle"'],
      current: localized.defaults.title,
    },
    {
      name: "description",
      type: "string | undefined",
      description: "Overrides or adds the supporting sentence below the title.",
      syntax: [
        'description="Try another keyword or clear your filters."',
        ':description="helperCopy"',
      ],
      current:
        localized.defaults.description ??
        "No preset description. You can omit it or pass one when needed.",
    },
    {
      name: "tone",
      type: "neutral | brand | danger | warning | success",
      description:
        "Changes the visual emphasis and semantic color treatment of the shared shell.",
      syntax: ['tone="brand"', ':tone="currentTone"'],
      current: localized.defaults.tone ?? "neutral",
    },
    {
      name: "density",
      type: "compact | cozy | spacious",
      description:
        "Controls spacing and media scale so the same category entry can fit inline, panel, or page contexts.",
      syntax: ['density="compact"', ':density="density"'],
      current: localized.defaults.density ?? "cozy",
    },
    {
      name: "layout",
      type: meta.supportedLayouts.join(" | "),
      description:
        "Chooses the layout variant for this preset. Unsupported values fall back to the preset default automatically.",
      syntax: [
        `layout="${localized.defaults.layout}"`,
        ':layout="selectedLayout"',
      ],
      current: localized.defaults.layout ?? "panel",
    },
    {
      name: "primaryAction",
      type: "StateAction | null | undefined",
      description:
        "Defines or replaces the main CTA. Pass `null` when you want to hide the preset primary button.",
      syntax: [
        `:primary-action="{ label: '${defaultActionLabels.value[0] ?? "Create item"}', onClick: handlePrimaryClick }"`,
        ':primary-action="primaryAction"',
        ':primary-action="null"',
      ],
      current: localized.defaults.primaryAction
        ? localized.defaults.primaryAction.label
        : "No preset primary action.",
    },
    {
      name: "secondaryAction",
      type: "StateAction | null | undefined",
      description:
        "Defines, replaces, or removes the secondary CTA. Use it for lower-priority alternatives such as go back, compare, or learn more.",
      syntax: [
        `:secondary-action="{ label: '${defaultActionLabels.value[1] ?? "Learn more"}', href: '/docs/installation' }"`,
        ':secondary-action="secondaryAction"',
        ':secondary-action="null"',
      ],
      current: localized.defaults.secondaryAction
        ? localized.defaults.secondaryAction.label
        : "No preset secondary action.",
    },
  ];
});

const parameterExamples = computed<CodeExample[]>(() => {
  if (!recipeMeta.value) {
    return [];
  }

  if (locale.value === "zh-CN") {
    return [
      {
        title: "1. 在模板里直接传固定值",
        description:
          "当页面里的 recipe 内容是固定的，可以用这种写法。字符串和枚举类 prop 不需要加 `:`。",
        code: usageSnippet.value,
      },
      {
        title: "2. 绑定 `<script setup>` 里的变量",
        description:
          "来自 ref、本地常量或脚本里 action 对象的值，都使用 `:` 绑定。",
        code: scriptBindingSnippet.value,
      },
      {
        title: "3. 组合一个 props 对象，再用 `v-bind` 展开",
        description:
          "当页面需要根据 computed state、feature flag 或异步任务状态组合 recipe 时，用这个模式更清楚。",
        code: objectBindingSnippet.value,
      },
    ];
  }

  return [
    {
      title: "1. Pass fixed values directly in the template",
      description:
        "Use this form when the recipe content is static for the page. Strings and enum-like props can be written without `:`.",
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
        "Use this pattern when the page composes the recipe from computed state, feature flags, or async task status.",
      code: objectBindingSnippet.value,
    },
  ];
});

const actionExamples = computed<CodeExample[]>(() => {
  if (!recipeMeta.value) {
    return [];
  }

  if (locale.value === "zh-CN") {
    return [
      {
        title: "StateAction 对象结构",
        description:
          "每个按钮或链接都使用同一个 shared action 对象。它就是传给 `primaryAction` 和 `secondaryAction` 的表面。",
        code: stateActionTypeSnippet,
      },
      {
        title: "点击处理、loading 文案、禁用态和链接",
        description:
          "把 CTA 逻辑放进 action 对象。这个示例同时展示 `onClick`、`href`、`loading`、`loadingLabel` 和 `disabled`。",
        code: actionSnippet.value,
      },
    ];
  }

  return [
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
  ];
});

const relatedRecipes = computed(() => {
  const meta = recipeMeta.value;
  if (!meta) {
    return [];
  }

  return allRecipeDocs
    .filter((item) => item.category === meta.category && item.id !== meta.id)
    .slice(0, 3)
    .map((item) => ({
      ...item,
      categoryLabel: getCategoryLabel(locale.value, item.category),
      localized: getRecipeCopy(item, locale.value),
    }));
});
</script>

<template>
  <section class="page-stack">
    <template v-if="recipeMeta && localizedRecipe">
      <section class="page-hero page-hero--detail">
        <div>
          <p class="eyebrow">{{ categoryLabel }} {{ copy.recipeLabel }}</p>
          <h1>{{ localizedRecipe.defaults.title }}</h1>
          <p>{{ localizedRecipe.summary }}</p>
        </div>

        <div class="page-hero__facts">
          <div class="page-fact">
            <strong>{{ recipeMeta.priority }}</strong>
            <span>{{ copy.facts.priority }}</span>
          </div>
          <div class="page-fact">
            <strong>{{ localizedRecipe.defaults.layout }}</strong>
            <span>{{ copy.facts.defaultLayout }}</span>
          </div>
          <div class="page-fact">
            <strong>{{ recipeMeta.supportedLayouts.length }}</strong>
            <span>{{ copy.facts.layoutsSupported }}</span>
          </div>
        </div>
      </section>

      <section class="detail-layout">
        <article class="detail-preview" data-testid="recipe-detail-preview">
          <div class="detail-preview__header">
            <div>
              <p class="detail-preview__eyebrow">{{ copy.livePreview }}</p>
              <h2>{{ recipeMeta.componentName }}</h2>
            </div>

            <div class="detail-preview__meta">
              <span class="meta-pill">{{ localizedRecipe.defaults.tone }}</span>
              <span class="meta-pill">{{ localizedRecipe.defaults.density }}</span>
              <span class="meta-pill">{{ localizedRecipe.defaults.layout }}</span>
            </div>
          </div>

          <div class="detail-preview__surface" data-testid="recipe-detail-live-preview">
            <component :is="recipeComponent" v-bind="localizedRecipe.defaults" />
          </div>
        </article>

        <div class="detail-info-grid">
          <section class="detail-section" data-testid="recipe-detail-metadata">
            <h2>{{ copy.metadataTitle }}</h2>
            <dl class="detail-definition-list">
              <div>
                <dt>{{ copy.metadata.slug }}</dt>
                <dd>{{ recipeMeta.slug }}</dd>
              </div>
              <div>
                <dt>{{ copy.metadata.publicEntry }}</dt>
                <dd>{{ recipeMeta.componentName }}</dd>
              </div>
              <div>
                <dt>{{ copy.metadata.priority }}</dt>
                <dd>{{ recipeMeta.priority }}</dd>
              </div>
              <div>
                <dt>{{ copy.metadata.layouts }}</dt>
                <dd>{{ recipeMeta.supportedLayouts.join(", ") }}</dd>
              </div>
            </dl>
          </section>

          <section class="detail-section">
            <h2>{{ copy.defaultsTitle }}</h2>
            <ul class="detail-bullet-list">
              <li><strong>{{ copy.defaults.tone }}:</strong> {{ localizedRecipe.defaults.tone }}</li>
              <li><strong>{{ copy.defaults.density }}:</strong> {{ localizedRecipe.defaults.density }}</li>
              <li><strong>{{ copy.defaults.layout }}:</strong> {{ localizedRecipe.defaults.layout }}</li>
              <li v-if="defaultActionLabels.length">
                <strong>{{ copy.defaults.defaultActions }}:</strong>
                {{ defaultActionLabels.join(", ") }}
              </li>
            </ul>
          </section>

          <section class="detail-section detail-section--usage">
            <h2>{{ copy.usageTitle }}</h2>
            <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
          </section>
        </div>
      </section>

      <section class="section-card section-card--outline">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ copy.guideEyebrow }}</p>
            <h2>{{ copy.guideTitle(recipeMeta.componentName) }}</h2>
          </div>
          <p>{{ copy.guideDescription }}</p>
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
            <h3>{{ copy.customizeTitle }}</h3>
            <ul class="detail-bullet-list">
              <li v-for="note in customizationNotes" :key="note">{{ note }}</li>
            </ul>
          </section>

          <section class="detail-section detail-section--doc">
            <h3>{{ copy.quickStartTitle }}</h3>
            <p>{{ copy.quickStartDescription }}</p>
            <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
          </section>
        </div>
      </section>

      <section class="section-card section-card--outline">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ copy.propsEyebrow }}</p>
            <h2>{{ copy.propsTitle }}</h2>
          </div>
          <p>{{ copy.propsDescription }}</p>
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
              <strong>{{ copy.passItAs }}</strong>
              <ul class="detail-inline-code-list">
                <li v-for="syntax in prop.syntax" :key="syntax">
                  <code>{{ syntax }}</code>
                </li>
              </ul>
            </div>
            <p class="detail-prop-card__hint">
              <strong>{{ copy.currentDefault }}</strong> {{ prop.current }}
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

      <section
        v-if="recipeMeta.category === 'onboarding'"
        class="section-card section-card--outline"
      >
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ copy.slotsEyebrow }}</p>
            <h2>{{ copy.slotsTitle }}</h2>
          </div>
          <p>{{ copy.slotsDescription }}</p>
        </div>

        <div class="detail-doc-grid">
          <section
            v-for="slotDoc in onboardingSlotDocs[locale]"
            :key="slotDoc.name"
            class="detail-section detail-section--doc"
          >
            <h3>{{ slotDoc.name }}</h3>
            <p>{{ slotDoc.description }}</p>
          </section>
        </div>
      </section>

      <section class="section-card section-card--outline">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ copy.actionsEyebrow }}</p>
            <h2>{{ copy.actionsTitle }}</h2>
          </div>
          <p>{{ copy.actionsDescription }}</p>
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
            v-for="field in actionFieldDocs[locale]"
            :key="field.name"
            class="detail-prop-card detail-prop-card--compact"
          >
            <div class="detail-prop-card__top">
              <h3>{{ field.name }}</h3>
              <span class="meta-pill">{{ field.type }}</span>
            </div>
            <p>{{ field.description }}</p>
            <div class="detail-prop-card__group">
              <strong>{{ copy.typicalValue }}</strong>
              <ul class="detail-inline-code-list">
                <li v-for="syntax in field.syntax" :key="syntax">
                  <code>{{ syntax }}</code>
                </li>
              </ul>
            </div>
            <p class="detail-prop-card__hint">
              <strong>{{ copy.note }}</strong> {{ field.current }}
            </p>
          </article>
        </div>

        <section class="detail-section detail-section--doc detail-section--full">
          <h3>{{ copy.passingRulesTitle }}</h3>
          <ol class="plain-list">
            <li v-for="rule in parameterRules[locale]" :key="rule">{{ rule }}</li>
          </ol>
        </section>
      </section>

      <section
        v-if="relatedRecipes.length"
        class="section-card section-card--outline"
      >
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ copy.relatedEyebrow }}</p>
            <h2>{{ copy.relatedTitle }}</h2>
          </div>
          <p>{{ copy.relatedDescription }}</p>
        </div>

        <div class="related-grid">
          <RouterLink
            v-for="item in relatedRecipes"
            :key="item.id"
            class="editorial-link"
            :data-testid="`recipe-related-${item.slug}`"
            :to="routePath('/recipes/' + item.slug)"
          >
            <span class="editorial-link__index">{{ item.categoryLabel }}</span>
            <div>
              <h3>{{ item.localized.defaults.title }}</h3>
              <p>{{ item.localized.summary }}</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </template>

    <section v-else class="section-card section-card--empty" data-testid="recipe-detail-missing">
      <p class="eyebrow">{{ copy.missingEyebrow }}</p>
      <h1>{{ copy.missingTitle }}</h1>
      <p>{{ copy.missingDescription }}</p>
    </section>
  </section>
</template>
