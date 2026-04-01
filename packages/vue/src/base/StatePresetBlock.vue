<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ?? block ?????
 * 2. ???????? block id ????????????????????????
 * 3. ????????? shared ? vue ????? props ???????????????
 */
import { computed } from "vue";
import { stateBlockMetaById, type BaseStateProps, type StateBlockId } from "@statekit/shared";
import StateBlockShell from "./StateBlockShell.vue";
import type { PresetStateBlockProps } from "../types";
interface Props extends PresetStateBlockProps { blockId: StateBlockId; }
const props = defineProps<Props>();
const blockMeta = computed(() => stateBlockMetaById[props.blockId]);
const mergedProps = computed<BaseStateProps>(() => ({ ...blockMeta.value.defaults, title: props.title ?? blockMeta.value.defaults.title, description: props.description ?? blockMeta.value.defaults.description, tone: props.tone ?? blockMeta.value.defaults.tone ?? "neutral", density: props.density ?? blockMeta.value.defaults.density ?? "cozy", layout: props.layout ?? blockMeta.value.defaults.layout ?? "panel", primaryAction: props.primaryAction ?? blockMeta.value.defaults.primaryAction, secondaryAction: props.secondaryAction ?? blockMeta.value.defaults.secondaryAction }));
</script>

<template><StateBlockShell v-bind="mergedProps" :category="blockMeta.category" /></template>
