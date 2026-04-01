/**
 * StateKit ?????
 * 1. ?????????
 * 2. ???????????????????????????????????
 * 3. ??????? API ???????????????????????????
 */

import type { StateBlockMeta } from "@statekit/shared";
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
export function blockUsageSnippet(meta: StateBlockMeta) { return ['import { ' + meta.componentName + ' } from "@statekit/vue";', '', '<template>', '  <' + meta.componentName + ' layout="' + meta.defaults.layout + '" density="' + meta.defaults.density + '" tone="' + meta.defaults.tone + '" />', '</template>'].join("\n"); }
