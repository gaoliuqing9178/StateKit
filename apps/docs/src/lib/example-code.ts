import type {
  StateActionSlot,
  StateBlockMeta as StateRecipeMeta,
} from "@statekit-vue/shared";

export const installSnippet = "npm install @statekit-vue/vue";

export const stylesheetSnippet = 'import "@statekit-vue/vue/styles.css";';

export const minimalUsageSnippet = [
  '<script setup lang="ts">',
  'import { EmptyState } from "@statekit-vue/vue";',
  "</script>",
  "",
  "<template>",
  "  <EmptyState",
  '    title="No matching invoices"',
  '    description="Try a different keyword or clear your current filters."',
  '    :primary-action="{ label: \'Clear filters\' }"',
  '    :secondary-action="{ label: \'Create invoice\' }"',
  "  />",
  "</template>",
].join("\n");

export const stateActionTypeSnippet = [
  "interface StateAction {",
  "  label: string;",
  "  href?: string;",
  "  disabled?: boolean;",
  "  loading?: boolean;",
  "  loadingLabel?: string;",
  "  onClick?: (event: MouseEvent) => void | Promise<void>;",
  "}",
].join("\n");

function toSingleQuoted(value: string) {
  return `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
}

function toDoubleQuotedAttr(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function actionLabel(action: StateActionSlot | undefined, fallback: string) {
  return action?.label ?? fallback;
}

function loadingLabelFrom(action: StateActionSlot | undefined) {
  if (action?.loadingLabel) {
    return action.loadingLabel;
  }

  return `${actionLabel(action, "Run action")}...`;
}

function appendLiteralActionAttribute(
  lines: string[],
  propName: "primary-action" | "secondary-action",
  action: StateActionSlot | undefined,
) {
  if (!action) {
    return;
  }

  lines.push(`    :${propName}="{`);
  lines.push(`      label: ${toSingleQuoted(action.label)},`);

  if (action.href) {
    lines.push(`      href: ${toSingleQuoted(action.href)},`);
  }

  if (action.disabled) {
    lines.push("      disabled: true,");
  }

  if (action.loading) {
    lines.push("      loading: true,");
  }

  if (action.loadingLabel) {
    lines.push(`      loadingLabel: ${toSingleQuoted(action.loadingLabel)},`);
  }

  lines.push('    }"');
}

function sharedImportLines(componentName: string) {
  return [
    'import "@statekit-vue/vue/styles.css";',
    `import { ${componentName} } from "@statekit-vue/vue";`,
  ];
}

export function recipeUsageSnippet(recipeMeta: StateRecipeMeta) {
  const lines = [
    ...sharedImportLines(recipeMeta.componentName),
    "",
    "<template>",
    `  <${recipeMeta.componentName}`,
    `    title="${toDoubleQuotedAttr(recipeMeta.defaults.title)}"`,
  ];

  if (recipeMeta.defaults.description) {
    lines.push(
      `    description="${toDoubleQuotedAttr(recipeMeta.defaults.description)}"`,
    );
  }

  if (recipeMeta.defaults.tone) {
    lines.push(`    tone="${recipeMeta.defaults.tone}"`);
  }

  if (recipeMeta.defaults.density) {
    lines.push(`    density="${recipeMeta.defaults.density}"`);
  }

  if (recipeMeta.defaults.layout) {
    lines.push(`    layout="${recipeMeta.defaults.layout}"`);
  }

  appendLiteralActionAttribute(
    lines,
    "primary-action",
    recipeMeta.defaults.primaryAction,
  );
  appendLiteralActionAttribute(
    lines,
    "secondary-action",
    recipeMeta.defaults.secondaryAction,
  );

  lines.push("  />", "</template>");

  return lines.join("\n");
}

export function recipeScriptBindingSnippet(recipeMeta: StateRecipeMeta) {
  const titleText = recipeMeta.defaults.title;
  const descriptionText =
    recipeMeta.defaults.description ??
    "Rewrite the supporting copy so it matches the exact moment in your product.";
  const primaryLabel = actionLabel(
    recipeMeta.defaults.primaryAction,
    "Open next step",
  );

  return [
    '<script setup lang="ts">',
    'import { ref } from "vue";',
    `import { ${recipeMeta.componentName} } from "@statekit-vue/vue";`,
    "",
    `const pageTitle = ref(${toSingleQuoted(titleText)});`,
    `const helperCopy = ref(${toSingleQuoted(descriptionText)});`,
    "",
    "const primaryAction = {",
    `  label: ${toSingleQuoted(primaryLabel)},`,
    "  onClick: () => {",
    "    console.log(\"Handle the primary action here\");",
    "  },",
    "};",
    "",
    "const secondaryAction = null;",
    "</script>",
    "",
    "<template>",
    `  <${recipeMeta.componentName}`,
    '    :title="pageTitle"',
    '    :description="helperCopy"',
    `    tone="${recipeMeta.defaults.tone}"`,
    `    density="${recipeMeta.defaults.density}"`,
    `    layout="${recipeMeta.defaults.layout}"`,
    '    :primary-action="primaryAction"',
    '    :secondary-action="secondaryAction"',
    "  />",
    "</template>",
  ].join("\n");
}

export function recipeObjectBindingSnippet(recipeMeta: StateRecipeMeta) {
  const titleText = recipeMeta.defaults.title;
  const descriptionText =
    recipeMeta.defaults.description ??
    "Compose all state props in one object when the page derives them from state.";
  const primaryLabel = actionLabel(recipeMeta.defaults.primaryAction, "Continue");
  const loadingLabel = loadingLabelFrom(recipeMeta.defaults.primaryAction);

  return [
    '<script setup lang="ts">',
    'import { computed, ref } from "vue";',
    `import { ${recipeMeta.componentName} } from "@statekit-vue/vue";`,
    "",
    "const busy = ref(false);",
    "",
    "function handlePrimaryClick() {",
    "  busy.value = true;",
    "}",
    "",
    "const stateProps = computed(() => ({",
    `  title: ${toSingleQuoted(titleText)},`,
    `  description: ${toSingleQuoted(descriptionText)},`,
    `  tone: ${toSingleQuoted(recipeMeta.defaults.tone ?? "neutral")},`,
    `  density: ${toSingleQuoted(recipeMeta.defaults.density ?? "cozy")},`,
    `  layout: ${toSingleQuoted(recipeMeta.defaults.layout ?? "panel")},`,
    "  primaryAction: {",
    `    label: ${toSingleQuoted(primaryLabel)},`,
    "    onClick: handlePrimaryClick,",
    "    loading: busy.value,",
    `    loadingLabel: ${toSingleQuoted(loadingLabel)},`,
    "  },",
    "  secondaryAction: null,",
    "}));",
    "</script>",
    "",
    "<template>",
    `  <${recipeMeta.componentName} v-bind="stateProps" />`,
    "</template>",
  ].join("\n");
}

export function recipeActionSnippet(recipeMeta: StateRecipeMeta) {
  const primaryLabel = actionLabel(recipeMeta.defaults.primaryAction, "Retry");
  const secondaryLabel = actionLabel(
    recipeMeta.defaults.secondaryAction,
    "Open docs",
  );
  const loadingLabel = loadingLabelFrom(recipeMeta.defaults.primaryAction);

  return [
    '<script setup lang="ts">',
    'import { ref } from "vue";',
    `import { ${recipeMeta.componentName} } from "@statekit-vue/vue";`,
    "",
    "const pending = ref(false);",
    "",
    "async function handlePrimaryClick() {",
    "  pending.value = true;",
    "  try {",
    "    await Promise.resolve();",
    "  } finally {",
    "    pending.value = false;",
    "  }",
    "}",
    "</script>",
    "",
    "<template>",
    `  <${recipeMeta.componentName}`,
    '    :primary-action="{',
    `      label: ${toSingleQuoted(primaryLabel)},`,
    "      onClick: handlePrimaryClick,",
    "      loading: pending,",
    `      loadingLabel: ${toSingleQuoted(loadingLabel)},`,
    '    }"',
    '    :secondary-action="{',
    `      label: ${toSingleQuoted(secondaryLabel)},`,
    "      href: '/docs/installation',",
    "      disabled: pending,",
    '    }"',
    "  />",
    "</template>",
  ].join("\n");
}
