/**
 * StateKit ?????
 * 1. ??????????
 * 2. ????????????????????????????
 * 3. ????????????????????????????????
 */

export const homeCopy = {
  eyebrow: "Category-first State UI",
  title: "Category-first state components for Vue teams",
  description:
    "StateKit gives Vue teams six public state categories with one shared API, backed by 18 preset recipes for empty, loading, error, permission, upgrade, and success moments.",
};
export const installationSteps = [
  "Install `@statekit-vue/vue` in the Vue 3.4+ workspace that renders the category components.",
  "Import `@statekit-vue/vue/styles.css` once before rendering any StateKit recipe.",
  "Import one category component from `@statekit-vue/vue` and override only the copy and CTA props you need.",
  "Install `@statekit-vue/shared` separately only when you need metadata or shared types without the Vue UI package.",
];
export const examplePages = [
  {
    href: "/examples/admin-empty-states",
    title: "Admin Empty States",
    description:
      "Interactive empty states showing inline search recovery, async collection creation, and first-run onboarding setup.",
  },
  {
    href: "/examples/permissions-and-upgrade",
    title: "Permissions And Upgrade",
    description:
      "Permission and billing gates rewritten around request-access actions, session recovery, disabled CTAs, and upgrade decisions.",
  },
  {
    href: "/examples/task-flow",
    title: "Task Flow",
    description:
      "A task lifecycle example that demonstrates custom loading labels, inline retries, CTA links, and completion handoff actions.",
  },
];
