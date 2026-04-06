<script setup lang="ts">
import type { BaseStateProps } from "@statekit-vue/shared";
import StateBlockShell from "../../base/StateBlockShell.vue";
import { useMergedStateProps } from "../../lib/merge-state-props";
import type { PresetStateBlockProps } from "../../types";

const props = defineProps<PresetStateBlockProps>();

const defaultProps: BaseStateProps = {
  title: "Upgrade to continue",
  description:
    "Move to a higher plan to unlock this workflow and higher limits.",
  tone: "brand",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Upgrade plan" },
  secondaryAction: { label: "Compare plans" },
};

const mergedProps = useMergedStateProps(props, defaultProps);
</script>

<template>
  <StateBlockShell v-bind="mergedProps" category="upgrade" />
</template>
