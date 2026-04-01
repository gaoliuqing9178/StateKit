<script setup lang="ts">
/**
 * StateKit ?????
 * 1. ?????????
 * 2. ????????? block ??????????????? CTA ???
 * 3. ???????????????????????????????????????
 */
import { computed } from "vue";
import type { BaseStateProps, StateAction, StateCategory, StateDensity, StateLayout, StateTone } from "@statekit/shared";
interface Props extends BaseStateProps { category?: StateCategory; }
const props = withDefaults(defineProps<Props>(), { tone: "neutral" as StateTone, density: "cozy" as StateDensity, layout: "panel" as StateLayout, category: "empty" as StateCategory });
const actions = computed(() => [props.primaryAction, props.secondaryAction].filter(Boolean) as StateAction[]);
const categoryLabel = computed(() => props.category.charAt(0).toUpperCase() + props.category.slice(1));
</script>

<template><section class="sk-shell" :data-category="category" :data-density="density" :data-layout="layout" :data-tone="tone"><div class="sk-shell__inner"><div class="sk-shell__media" aria-hidden="true"><div class="sk-shell__media-frame"><slot name="media"><div v-if="category === 'loading'" class="sk-figure sk-figure--loading"><span class="sk-figure__ring" /><span class="sk-figure__bar is-wide" /><span class="sk-figure__bar is-medium" /><span class="sk-figure__bar is-short" /></div><div v-else-if="category === 'error'" class="sk-figure sk-figure--error"><span class="sk-figure__badge" /><span class="sk-figure__cross" /><span class="sk-figure__cross is-secondary" /><span class="sk-figure__shadow-line" /></div><div v-else-if="category === 'permission'" class="sk-figure sk-figure--permission"><span class="sk-figure__panel" /><span class="sk-figure__panel is-back" /><span class="sk-figure__lock-body" /><span class="sk-figure__lock-arch" /></div><div v-else-if="category === 'upgrade'" class="sk-figure sk-figure--upgrade"><span class="sk-figure__panel" /><span class="sk-figure__panel is-back" /><span class="sk-figure__spark" /><span class="sk-figure__spark is-secondary" /></div><div v-else-if="category === 'success'" class="sk-figure sk-figure--success"><span class="sk-figure__badge" /><span class="sk-figure__check" /><span class="sk-figure__check is-secondary" /><span class="sk-figure__shadow-line" /></div><div v-else class="sk-figure sk-figure--empty"><span class="sk-figure__panel" /><span class="sk-figure__panel is-back" /><span class="sk-figure__bar is-wide" /><span class="sk-figure__bar is-medium" /><span class="sk-figure__bar is-short" /></div></slot></div></div><div class="sk-shell__content"><p class="sk-shell__kicker">{{ categoryLabel }}</p><h2 class="sk-shell__title">{{ title }}</h2><p v-if="description" class="sk-shell__description">{{ description }}</p><div v-if="actions.length" class="sk-shell__actions"><component :is="action.href ? 'a' : 'button'" v-for="(action, index) in actions" :key="action.label" class="sk-shell__action" :class="{ 'is-secondary': index > 0 }" :disabled="!action.href && action.disabled" :href="action.href" type="button">{{ action.loading ? "Working..." : action.label }}</component></div></div></div></section></template>
