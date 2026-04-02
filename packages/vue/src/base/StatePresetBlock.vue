<script setup lang="ts">
import { computed } from "vue";
import {
  stateBlockMetaById,
  type BaseStateProps,
  type StateBlockId,
} from "@statekit/shared";
import StateBlockShell from "./StateBlockShell.vue";
import type { PresetStateBlockProps } from "../types";

interface Props extends PresetStateBlockProps {
  blockId: StateBlockId;
}

const props = defineProps<Props>();

const blockMeta = computed(() => stateBlockMetaById[props.blockId]);

const resolvedLayout = computed(() => {
  const requestedLayout = props.layout;
  const defaultLayout = blockMeta.value.defaults.layout ?? "panel";

  if (
    !requestedLayout ||
    blockMeta.value.supportedLayouts.includes(requestedLayout)
  ) {
    return requestedLayout ?? defaultLayout;
  }

  console.warn(
    `[StateKit] "${blockMeta.value.componentName}" does not support the "${requestedLayout}" layout. Falling back to "${defaultLayout}".`,
  );

  return defaultLayout;
});

const mergedProps = computed<BaseStateProps>(() => ({
  ...blockMeta.value.defaults,
  title: props.title ?? blockMeta.value.defaults.title,
  description: props.description ?? blockMeta.value.defaults.description,
  tone: props.tone ?? blockMeta.value.defaults.tone ?? "neutral",
  density: props.density ?? blockMeta.value.defaults.density ?? "cozy",
  layout: resolvedLayout.value,
  primaryAction:
    props.primaryAction === undefined
      ? blockMeta.value.defaults.primaryAction
      : props.primaryAction,
  secondaryAction:
    props.secondaryAction === undefined
      ? blockMeta.value.defaults.secondaryAction
      : props.secondaryAction,
}));
</script>

<template>
  <StateBlockShell v-bind="mergedProps" :category="blockMeta.category" />
</template>
