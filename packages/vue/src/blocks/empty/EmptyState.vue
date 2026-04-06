<script setup lang="ts">
import type { BaseStateProps } from "@statekit-vue/shared";
import StateBlockShell from "../../base/StateBlockShell.vue";
import { useMergedStateProps } from "../../lib/merge-state-props";
import type { PresetStateBlockProps } from "../../types";

const props = defineProps<PresetStateBlockProps>();

const defaultProps: BaseStateProps = {
  title: "Nothing here yet",
  description:
    "Create your first item or change the current view to keep moving.",
  tone: "neutral",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Create item" },
  secondaryAction: { label: "Import" },
};

const mergedProps = useMergedStateProps(props, defaultProps);
</script>

<template>
  <StateBlockShell v-bind="mergedProps" category="empty" />
</template>
