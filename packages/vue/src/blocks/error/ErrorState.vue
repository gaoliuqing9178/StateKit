<script setup lang="ts">
import type { BaseStateProps } from "@statekit-vue/shared";
import StateBlockShell from "../../base/StateBlockShell.vue";
import { useMergedStateProps } from "../../lib/merge-state-props";
import type { PresetStateBlockProps } from "../../types";

const props = defineProps<PresetStateBlockProps>();

const defaultProps: BaseStateProps = {
  title: "Something went wrong",
  description:
    "Try again or return to a stable place while we recover this view.",
  tone: "danger",
  density: "cozy",
  layout: "panel",
  primaryAction: { label: "Try again" },
  secondaryAction: { label: "Go back" },
};

const mergedProps = useMergedStateProps(props, defaultProps);
</script>

<template>
  <StateBlockShell v-bind="mergedProps" category="error" />
</template>
