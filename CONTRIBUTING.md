# Contributing

Thanks for contributing to StateKit.

StateKit is a narrow, scenario-first state UI library for SaaS products. It is not a general-purpose component kit. Contributions should strengthen the existing empty / loading / error / permission / upgrade / success flows instead of expanding the project into a broad design system.

## Before You Change Anything

Read these files first:

1. [`README.md`](./README.md)
2. [`docs/README.md`](./docs/README.md)
3. [`docs/statekit-block-spec.md`](./docs/statekit-block-spec.md)
4. [`docs/statekit-v1-product-plan.md`](./docs/statekit-v1-product-plan.md)
5. [`docs/statekit-launch-checklist.md`](./docs/statekit-launch-checklist.md)

If implementation and docs disagree, treat the source code in `packages/shared` as the source of truth first, then bring the docs back into alignment.

## Repository Layout

```text
apps/docs
packages/shared
packages/vue
examples/vite-vue-admin
docs
```

- `packages/shared`: shared types, block ids, metadata, and lookup helpers
- `packages/vue`: Vue components, exports, and shared styles
- `apps/docs`: docs site and the main manual QA surface
- `examples/vite-vue-admin`: realistic external-consumer example
- `docs`: internal product, implementation, QA, and release docs

## Contribution Rules

### 1. Prefer category-first public API

The main public API is now:

- `EmptyState`
- `LoadingState`
- `ErrorState`
- `PermissionState`
- `UpgradeState`
- `SuccessState`

The older scenario-specific names such as `EmptySearchState`, `PageErrorState`, or `UpgradePlanState` remain available as deprecated compatibility exports. Do not introduce new scenario-specific public component names unless there is a strong, explicit reason to do so.

### 2. Treat preset recipes as metadata-first

StateKit still keeps 18 preset recipes. Those recipes live in shared metadata and define default:

- `title`
- `description`
- `tone`
- `density`
- `layout`
- `primaryAction`
- `secondaryAction`

If you are changing copy, default CTA labels, supported layouts, or block identity, start in:

- [`packages/shared/src/types.ts`](./packages/shared/src/types.ts)
- [`packages/shared/src/block-meta.ts`](./packages/shared/src/block-meta.ts)

### 3. Keep the implementation order stable

When changing behavior, work in this order:

1. Update shared types or metadata.
2. Update Vue implementation or exports.
3. Update docs previews and example integrations.
4. Update README, changelog, and internal docs.

Do not start by changing docs copy and leave the implementation behind.

### 4. Respect current product boundaries

Unless the roadmap changes explicitly, avoid contributions that:

- add a third CTA
- add a complex slot system
- imply React or multi-framework support
- turn StateKit into a highly flexible page builder
- split onboarding into a separate category without strong product justification

## Local Setup

Use `npm`, because the workspace scripts and release checks are written around npm workspaces.

```bash
npm install
```

Useful commands from the repo root:

```bash
npm run dev:docs
npm run dev:example
npm run typecheck
npm run build
npm run pack:check
npm run smoke:install
```

## Where To Make Changes

### Shared metadata or API shape

Start here when changing ids, defaults, categories, or prop contracts:

- [`packages/shared/src/types.ts`](./packages/shared/src/types.ts)
- [`packages/shared/src/block-meta.ts`](./packages/shared/src/block-meta.ts)

### Vue rendering behavior

Start here when changing shared rendering, layout behavior, or CTA handling:

- [`packages/vue/src/base/StatePresetBlock.vue`](./packages/vue/src/base/StatePresetBlock.vue)
- [`packages/vue/src/base/StateBlockShell.vue`](./packages/vue/src/base/StateBlockShell.vue)
- [`packages/vue/src/styles/base.css`](./packages/vue/src/styles/base.css)

### Category-first public components

Start here when changing the public category entry points:

- [`packages/vue/src/blocks/empty/EmptyState.vue`](./packages/vue/src/blocks/empty/EmptyState.vue)
- [`packages/vue/src/blocks/loading/LoadingState.vue`](./packages/vue/src/blocks/loading/LoadingState.vue)
- [`packages/vue/src/blocks/error/ErrorState.vue`](./packages/vue/src/blocks/error/ErrorState.vue)
- [`packages/vue/src/blocks/permission/PermissionState.vue`](./packages/vue/src/blocks/permission/PermissionState.vue)
- [`packages/vue/src/blocks/upgrade/UpgradeState.vue`](./packages/vue/src/blocks/upgrade/UpgradeState.vue)
- [`packages/vue/src/blocks/success/SuccessState.vue`](./packages/vue/src/blocks/success/SuccessState.vue)

### Docs and examples

Start here when changing previews, docs examples, or integration guidance:

- [`apps/docs/src/views/`](./apps/docs/src/views)
- [`apps/docs/src/lib/block-components.ts`](./apps/docs/src/lib/block-components.ts)
- [`apps/docs/src/lib/example-code.ts`](./apps/docs/src/lib/example-code.ts)
- [`examples/vite-vue-admin/src/App.vue`](./examples/vite-vue-admin/src/App.vue)

## Validation Checklist

At minimum, run:

```bash
npm run typecheck
npm run build
```

Also run these when your change affects package exports, install flow, or docs/example consumption:

```bash
npm run pack:check
npm run smoke:install
```

If your change affects visuals, layout, CTA behavior, or block defaults, also do manual QA in:

- `npm run dev:docs`
- `npm run dev:example`

Recommended widths to inspect:

- `1700`
- `1440`
- `1280`
- `1160`
- `1120`
- `1000`
- `920`
- `760`

## Documentation Sync

When you change public behavior, do not stop at code. Update the relevant docs too.

Most common sync targets:

- [`README.md`](./README.md)
- [`README.zh-CN.md`](./README.zh-CN.md)
- [`CHANGELOG.md`](./CHANGELOG.md)
- [`docs/README.md`](./docs/README.md)
- [`docs/statekit-block-spec.md`](./docs/statekit-block-spec.md)
- [`docs/statekit-ai-handoff-brief.md`](./docs/statekit-ai-handoff-brief.md)
- [`docs/statekit-launch-checklist.md`](./docs/statekit-launch-checklist.md)

If you change example usage or block guidance, make sure docs examples and block detail pages stay aligned with the real API surface.

## Pull Request Expectations

A good contribution usually includes:

- a short summary of what changed
- the reason the change is needed
- notes about API impact or compatibility impact
- the commands you ran to validate the change
- screenshots or short notes for visible UI changes

If you keep deprecated compatibility exports, say so clearly in the PR. If you remove one, explain why the break is necessary.

## Release-Facing Changes

If your change touches package exports, install guidance, or versioned behavior:

- keep package docs aligned with the actual package surface
- update release-facing notes in `CHANGELOG.md`
- avoid leaving contradictory status in handoff or checklist docs

## When In Doubt

Prefer the smaller, more defensible change:

- reuse an existing category component
- customize copy and CTA props instead of creating a new public component
- update shared metadata instead of duplicating behavior in Vue
- keep docs honest about what is implemented today
