<script setup lang="ts">
import type { BaseStateProps } from "@statekit-vue/shared";
import StateBlockShell from "../../base/StateBlockShell.vue";
import { useMergedStateProps } from "../../lib/merge-state-props";
import type { PresetStateBlockProps } from "../../types";

const props = defineProps<PresetStateBlockProps>();

const defaultProps: BaseStateProps = {
  title: "Done",
  description:
    "This step completed successfully. Review the result or continue to the next task.",
  tone: "success",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "View results" },
  secondaryAction: { label: "Continue" },
};

const mergedProps = useMergedStateProps(props, defaultProps);
</script>

<template>
  <StateBlockShell v-bind="mergedProps" category="success" />
</template>
