<script setup lang="ts">
import { computed } from "vue";
import type {
  BaseStateProps,
  StateAction,
  StateCategory,
  StateDensity,
  StateLayout,
  StateTone,
} from "@statekit/shared";

interface Props extends BaseStateProps {
  category?: StateCategory;
}

interface RenderedAction {
  key: string;
  source: StateAction;
  component: "a" | "button";
  href?: string;
  label: string;
  isSecondary: boolean;
  isDisabled: boolean;
  isUnavailable: boolean;
  isLoading: boolean;
  tabIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  tone: "neutral" as StateTone,
  density: "cozy" as StateDensity,
  layout: "panel" as StateLayout,
  category: "empty" as StateCategory,
});

const actions = computed<RenderedAction[]>(() =>
  [props.primaryAction, props.secondaryAction]
    .filter((action): action is StateAction => action != null)
    .map((action, index) => {
      const isDisabled = Boolean(action.disabled);
      const isLoading = Boolean(action.loading);
      const isUnavailable = isDisabled || isLoading;

      return {
        key: `${index}-${action.label}`,
        source: action,
        component: action.href ? "a" : "button",
        href: isUnavailable ? undefined : action.href,
        label: action.loading ? action.loadingLabel ?? "Working..." : action.label,
        isSecondary: index > 0,
        isDisabled,
        isUnavailable,
        isLoading,
        tabIndex: action.href && isUnavailable ? -1 : undefined,
      };
    }),
);

const categoryLabel = computed(
  () => props.category.charAt(0).toUpperCase() + props.category.slice(1),
);

function handleActionClick(action: RenderedAction, event: MouseEvent) {
  if (action.isUnavailable) {
    event.preventDefault();
    return;
  }

  action.source.onClick?.(event);
}
</script>

<template>
  <section
    class="sk-shell"
    :data-category="props.category"
    :data-density="props.density"
    :data-layout="props.layout"
    :data-tone="props.tone"
  >
    <div class="sk-shell__inner">
      <div class="sk-shell__media" aria-hidden="true">
        <div class="sk-shell__media-frame">
          <slot name="media">
            <div
              v-if="props.category === 'loading'"
              class="sk-figure sk-figure--loading"
            >
              <span class="sk-figure__ring" />
            </div>
            <div
              v-else-if="props.category === 'error'"
              class="sk-figure sk-figure--error"
            >
              <span class="sk-figure__badge" />
              <span class="sk-figure__cross" />
              <span class="sk-figure__cross is-secondary" />
              <span class="sk-figure__shadow-line" />
            </div>
            <div
              v-else-if="props.category === 'permission'"
              class="sk-figure sk-figure--permission"
            >
              <span class="sk-figure__panel" />
              <span class="sk-figure__panel is-back" />
              <span class="sk-figure__lock-body" />
              <span class="sk-figure__lock-arch" />
            </div>
            <div
              v-else-if="props.category === 'upgrade'"
              class="sk-figure sk-figure--upgrade"
            >
              <span class="sk-figure__panel" />
              <span class="sk-figure__panel is-back" />
              <span class="sk-figure__spark" />
              <span class="sk-figure__spark is-secondary" />
            </div>
            <div
              v-else-if="props.category === 'success'"
              class="sk-figure sk-figure--success"
            >
              <span class="sk-figure__badge" />
              <span class="sk-figure__check" />
              <span class="sk-figure__check is-secondary" />
              <span class="sk-figure__shadow-line" />
            </div>
            <div v-else class="sk-figure sk-figure--empty">
              <span class="sk-figure__panel" />
              <span class="sk-figure__panel is-back" />
            </div>
          </slot>
        </div>
      </div>

      <div class="sk-shell__content">
        <p class="sk-shell__kicker">{{ categoryLabel }}</p>
        <h2 class="sk-shell__title">{{ props.title }}</h2>
        <p v-if="props.description" class="sk-shell__description">
          {{ props.description }}
        </p>

        <div v-if="actions.length" class="sk-shell__actions">
          <component
            :is="action.component"
            v-for="action in actions"
            :key="action.key"
            class="sk-shell__action"
            :class="{
              'is-secondary': action.isSecondary,
              'is-disabled': action.isDisabled,
              'is-loading': action.isLoading,
            }"
            :aria-busy="action.isLoading ? 'true' : undefined"
            :aria-disabled="action.isUnavailable ? 'true' : undefined"
            :disabled="action.component === 'button' ? action.isUnavailable : undefined"
            :href="action.href"
            :tabindex="action.tabIndex"
            :type="action.component === 'button' ? 'button' : undefined"
            @click="handleActionClick(action, $event)"
          >
            {{ action.label }}
          </component>
        </div>
      </div>
    </div>
  </section>
</template>
