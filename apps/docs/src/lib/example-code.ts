import type { StateActionSlot, StateBlockMeta } from "@statekit/shared";

export const installSnippet = "npm install @statekit/vue";

export const baseUsageSnippet = [
  'import "@statekit/vue/styles.css";',
  'import { EmptySearchState } from "@statekit/vue";',
].join("\n");

export const minimalUsageSnippet = [
  "<template>",
  "  <EmptySearchState",
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
    'import "@statekit/vue/styles.css";',
    `import { ${componentName} } from "@statekit/vue";`,
  ];
}

export function blockUsageSnippet(meta: StateBlockMeta) {
  const lines = [
    ...sharedImportLines(meta.componentName),
    "",
    "<template>",
    `  <${meta.componentName}`,
    `    title="${toDoubleQuotedAttr(meta.defaults.title)}"`,
  ];

  if (meta.defaults.description) {
    lines.push(`    description="${toDoubleQuotedAttr(meta.defaults.description)}"`);
  }

  if (meta.defaults.tone) {
    lines.push(`    tone="${meta.defaults.tone}"`);
  }

  if (meta.defaults.density) {
    lines.push(`    density="${meta.defaults.density}"`);
  }

  if (meta.defaults.layout) {
    lines.push(`    layout="${meta.defaults.layout}"`);
  }

  appendLiteralActionAttribute(lines, "primary-action", meta.defaults.primaryAction);
  appendLiteralActionAttribute(lines, "secondary-action", meta.defaults.secondaryAction);

  lines.push("  />", "</template>");

  return lines.join("\n");
}

export function blockScriptBindingSnippet(meta: StateBlockMeta) {
  const titleText = meta.defaults.title;
  const descriptionText =
    meta.defaults.description ??
    "Rewrite the supporting copy so it matches the exact moment in your product.";
  const primaryLabel = actionLabel(meta.defaults.primaryAction, "Open next step");

  return [
    '<script setup lang="ts">',
    'import { ref } from "vue";',
    `import { ${meta.componentName} } from "@statekit/vue";`,
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
    `  <${meta.componentName}`,
    '    :title="pageTitle"',
    '    :description="helperCopy"',
    `    tone="${meta.defaults.tone}"`,
    `    density="${meta.defaults.density}"`,
    `    layout="${meta.defaults.layout}"`,
    '    :primary-action="primaryAction"',
    '    :secondary-action="secondaryAction"',
    "  />",
    "</template>",
  ].join("\n");
}

export function blockObjectBindingSnippet(meta: StateBlockMeta) {
  const titleText = meta.defaults.title;
  const descriptionText =
    meta.defaults.description ??
    "Compose all block props in one object when the page derives them from state.";
  const primaryLabel = actionLabel(meta.defaults.primaryAction, "Continue");
  const loadingLabel = loadingLabelFrom(meta.defaults.primaryAction);

  return [
    '<script setup lang="ts">',
    'import { computed, ref } from "vue";',
    `import { ${meta.componentName}, type PresetStateBlockProps } from "@statekit/vue";`,
    "",
    "const busy = ref(false);",
    "",
    "function handlePrimaryClick() {",
    "  busy.value = true;",
    "}",
    "",
    "const blockProps = computed<PresetStateBlockProps>(() => ({",
    `  title: ${toSingleQuoted(titleText)},`,
    `  description: ${toSingleQuoted(descriptionText)},`,
    `  tone: ${toSingleQuoted(meta.defaults.tone ?? "neutral")},`,
    `  density: ${toSingleQuoted(meta.defaults.density ?? "cozy")},`,
    `  layout: ${toSingleQuoted(meta.defaults.layout ?? "panel")},`,
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
    `  <${meta.componentName} v-bind="blockProps" />`,
    "</template>",
  ].join("\n");
}

export function blockActionSnippet(meta: StateBlockMeta) {
  const primaryLabel = actionLabel(meta.defaults.primaryAction, "Retry");
  const secondaryLabel = actionLabel(meta.defaults.secondaryAction, "Open docs");
  const loadingLabel = loadingLabelFrom(meta.defaults.primaryAction);

  return [
    '<script setup lang="ts">',
    'import { ref } from "vue";',
    `import { ${meta.componentName} } from "@statekit/vue";`,
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
    `  <${meta.componentName}`,
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
