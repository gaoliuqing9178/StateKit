<script setup lang="ts">
import type { BaseStateProps } from "@statekit-vue/shared";
import StateBlockShell from "../../base/StateBlockShell.vue";
import { useMergedStateProps } from "../../lib/merge-state-props";
import type { PresetStateBlockProps } from "../../types";

const props = defineProps<PresetStateBlockProps>();

const defaultProps: BaseStateProps = {
  title: "You do not have access",
  description:
    "Request access or return to a page you can use right now.",
  tone: "warning",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Request access" },
  secondaryAction: { label: "Go back" },
};

const mergedProps = useMergedStateProps(props, defaultProps);
</script>

<template>
  <StateBlockShell v-bind="mergedProps" category="permission" />
</template>
