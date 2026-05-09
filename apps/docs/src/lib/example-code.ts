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

export function recipeOnboardingSlotSnippet(
  recipeMeta: StateRecipeMeta,
  locale: "en" | "zh-CN" = "en",
) {
  const isZh = locale === "zh-CN";
  const primaryLabel = actionLabel(
    recipeMeta.defaults.primaryAction,
    isZh ? "开始设置" : "Start setup",
  );
  const secondaryLabel = actionLabel(
    recipeMeta.defaults.secondaryAction,
    isZh ? "查看指南" : "View guide",
  );
  const copy = isZh
    ? {
        mediaEyebrow: "启动路径",
        mediaTitle: "激活步骤预览",
        chip: "Onboarding recipe",
        railOne: "创建工作区",
        railTwo: "邀请成员",
        railThree: "连接集成",
        toolbarOne: "计划",
        toolbarTwo: "角色",
        toolbarThree: "进度",
        statOneLabel: "下一步",
        statOneValue: "03",
        statTwoLabel: "准备度",
        statTwoValue: "Ready",
        compare: "查看完整示例",
        skip: "暂时跳过",
        clickLog: "进入 onboarding 流程",
      }
    : {
        mediaEyebrow: "Launch path",
        mediaTitle: "Activation step preview",
        chip: "Onboarding recipe",
        railOne: "Create workspace",
        railTwo: "Invite members",
        railThree: "Connect integration",
        toolbarOne: "Plan",
        toolbarTwo: "Roles",
        toolbarThree: "Progress",
        statOneLabel: "Next steps",
        statOneValue: "03",
        statTwoLabel: "Readiness",
        statTwoValue: "Ready",
        compare: "View full example",
        skip: "Skip for now",
        clickLog: "Enter onboarding flow",
      };

  return [
    '<script setup lang="ts">',
    `import { ${recipeMeta.componentName} } from "@statekit-vue/vue";`,
    "",
    "function handlePrimaryClick() {",
    `  console.log(${toSingleQuoted(copy.clickLog)});`,
    "}",
    "</script>",
    "",
    "<template>",
    `  <${recipeMeta.componentName}`,
    `    title="${toDoubleQuotedAttr(recipeMeta.defaults.title)}"`,
    `    description="${toDoubleQuotedAttr(recipeMeta.defaults.description ?? "")}"`,
    '    layout="page"',
    '    density="spacious"',
    "  >",
    "    <template #media>",
    '      <div class="sk-onboarding-media">',
    '        <div class="sk-onboarding-media__header">',
    "          <div>",
    `            <p class="sk-onboarding-media__eyebrow">${copy.mediaEyebrow}</p>`,
    `            <strong class="sk-onboarding-media__title">${copy.mediaTitle}</strong>`,
    "          </div>",
    `          <span class="sk-onboarding-media__chip">${copy.chip}</span>`,
    "        </div>",
    "",
    '        <div class="sk-onboarding-media__window">',
    '          <div class="sk-onboarding-media__rail">',
    '            <div class="sk-onboarding-media__rail-entry is-active">',
    '              <span class="sk-onboarding-media__rail-dot" />',
    `              <span class="sk-onboarding-media__rail-label">${copy.railOne}</span>`,
    "            </div>",
    '            <div class="sk-onboarding-media__rail-entry">',
    '              <span class="sk-onboarding-media__rail-dot" />',
    `              <span class="sk-onboarding-media__rail-label">${copy.railTwo}</span>`,
    "            </div>",
    '            <div class="sk-onboarding-media__rail-entry">',
    '              <span class="sk-onboarding-media__rail-dot" />',
    `              <span class="sk-onboarding-media__rail-label">${copy.railThree}</span>`,
    "            </div>",
    "          </div>",
    "",
    '          <div class="sk-onboarding-media__canvas">',
    '            <div class="sk-onboarding-media__toolbar">',
    `              <span class="is-active">${copy.toolbarOne}</span>`,
    `              <span>${copy.toolbarTwo}</span>`,
    `              <span>${copy.toolbarThree}</span>`,
    "            </div>",
    '            <div class="sk-onboarding-media__stats">',
    '              <div class="sk-onboarding-media__stat">',
    `                <small>${copy.statOneLabel}</small>`,
    `                <strong>${copy.statOneValue}</strong>`,
    "              </div>",
    '              <div class="sk-onboarding-media__stat">',
    `                <small>${copy.statTwoLabel}</small>`,
    `                <strong>${copy.statTwoValue}</strong>`,
    "              </div>",
    "            </div>",
    "          </div>",
    "        </div>",
    "      </div>",
    "    </template>",
    "",
    "    <template #actions>",
    '      <div class="sk-onboarding-actions">',
    '        <div class="sk-onboarding-actions__group">',
    `          <button class="sk-shell__action" type="button" @click="handlePrimaryClick">${primaryLabel}</button>`,
    `          <a class="sk-shell__action is-secondary" href="/docs/installation">${secondaryLabel}</a>`,
    "        </div>",
    '        <div class="sk-onboarding-actions__secondary">',
    `          <a class="sk-shell__action is-secondary" href="/examples/onboarding-activation">${copy.compare}</a>`,
    `          <button class="sk-onboarding-actions__skip" type="button">${copy.skip}</button>`,
    "        </div>",
    "      </div>",
    "    </template>",
    `  </${recipeMeta.componentName}>`,
    "</template>",
  ].join("\n");
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
