# StateKit Changelog

## 2026-06-20 Release Prep (0.4.0)

### Changed

- Prepared the `0.4.0` minor release line for the React adapter launch.
- Bumped `@statekit-vue/shared` from `0.3.0` to `0.4.0`.
- Bumped `@statekit-vue/vue` from `0.3.0` to `0.4.0` and aligned its dependency on `@statekit-vue/shared` to `0.4.0`.
- Bumped `@statekit-vue/react` from `0.3.0` to `0.4.0` and aligned its dependency on `@statekit-vue/shared` to `0.4.0`.
- Aligned `apps/docs` and `examples/vite-vue-admin` on the `0.4.0` workspace line for release verification.

### Pending Publish

- `npm publish --workspace @statekit-vue/shared`
- `npm publish --workspace @statekit-vue/vue`
- `npm publish --workspace @statekit-vue/react`

## 2026-06-20 React Adapter (Unreleased)

### Added

- Added `@statekit-vue/react` as a React adapter package that reuses `@statekit-vue/shared` metadata and exports the same seven category-first entries as the Vue package.
- Added React compatibility preset exports for the existing 21 recipes.
- Added `@statekit-vue/react/styles.css` so React consumers can install the adapter without pulling in Vue runtime.
- Added React unit coverage for shell action semantics, preset metadata merging, unsupported layout fallback, and category-first defaults.
- Extended `pack:check`, `smoke:install`, `typecheck`, `build`, and `lint:boundaries` to include the React adapter.

### Verified

- `npm run typecheck --workspace @statekit-vue/react`
- `npm run build --workspace @statekit-vue/react`
- `npm run test:unit -- packages/react`
- `npm run lint:boundaries`

## 2026-05-09 Onboarding Recipe Slot Examples (Unreleased)

### Added

- Added rich `#media` and `#actions` slot examples to onboarding recipe detail live previews so `onboarding-workspace`, `onboarding-members`, and `onboarding-integration` read as guided activation surfaces instead of generic status blocks.
- Added an onboarding-specific slot code snippet on recipe detail pages showing a custom media preview, grouped primary/secondary actions, a full-example link, and a low-priority skip affordance.
- Expanded Playwright coverage for onboarding recipe detail pages, including assertions that the slot preview and snippet render.

### Fixed

- Tightened `.sk-onboarding-media__stat` value styling so longer labels such as `Workspace` stay inside the stat card boundary.
- Added a browser-level assertion that onboarding media stat values do not overflow their cards.

### Verified

- `npm run typecheck --workspace @statekit/docs`
- `npm run typecheck --workspace @statekit-vue/vue`
- `npm run verify:fast`
- `npm run test:ui`
- Playwright MCP on `/recipes/onboarding-workspace-state`
- Chrome DevTools MCP on `/recipes/onboarding-workspace-state`

## 2026-05-07 Chinese Docs Locale (Unreleased)

### Added

- Added a `/zh-CN` docs-site locale with Chinese routes for home, recipes, recipe details, installation, and all docs example entries.
- Added locale-aware top navigation and language switching that preserves the current page when moving between English and Chinese paths.
- Added docs-local Chinese recipe display copy so reader-facing titles, summaries, descriptions, CTA labels, and snippets can be localized without changing `packages/shared` metadata.
- Added `apps/docs/tests/chinese-locale.spec.ts` to cover Chinese home, recipes, detail, installation, and language switching.

### Changed

- Refactored docs copy into locale-aware helpers under `apps/docs/src/lib/` while keeping the existing English URLs and public recipe metadata unchanged.
- Updated `docs/statekit-docs-site-and-qa-spec.md` with the bilingual route map and localization constraints.

### Verified

- `npm run typecheck --workspace @statekit/docs`
- `npm run test:ui`
- `npm run build --workspace @statekit/docs`

## 2026-05-04 Release Prep (0.3.0)

### Added

- Prepared the `0.3.0` minor release line for the onboarding category work.
- Expanded the onboarding recipe family from one pilot recipe to three launch-ready recipes: `onboarding-workspace`, `onboarding-members`, and `onboarding-integration`.
- Added recipe-level onboarding demos and navigation coverage so `/examples/onboarding-activation` links back to all three onboarding recipe detail pages.

### Changed

- Bumped `@statekit-vue/shared` from `0.2.1` to `0.3.0`.
- Bumped `@statekit-vue/vue` from `0.2.1` to `0.3.0` and aligned its dependency on `@statekit-vue/shared` to `0.3.0`.
- Aligned `apps/docs` and `examples/vite-vue-admin` on the `0.3.0` workspace line for release verification.
- Updated the public recipe count from 19 to 21 while keeping the public category entry count at 7.

### Pending Verification

- `npm run typecheck`
- `npm run build`
- `npm run test:unit`
- `npm run test:ui`
- `npm run pack:check`
- `npm run smoke:install`

## 2026-04-27 Onboarding Hero Flow & Test Coverage (Unreleased)

### Added

- Added `apps/docs/src/views/examples/OnboardingActivationView.vue` as a dedicated onboarding example page, showing the full first-run activation flow from workspace creation through member invite and integration connect to completion.
- Added `/examples/onboarding-activation` route and redirected the default `/examples` entry to it so onboarding is now the primary example surface.
- Added five new Playwright test files: `home-featured-recipes.spec.ts`, `installation-navigation.spec.ts`, `mobile-layout.spec.ts`, `onboarding-activation.spec.ts`, and `recipe-detail-paths.spec.ts`, bringing the total browser-level test suite to 10 spec files covering all major routes and mobile breakpoints.
- Expanded `StateBlockShell` with improved mobile-layout styles and responsive adjustments in `packages/vue/src/styles/base.css`.

### Changed

- Rebuilt `examples/vite-vue-admin/src/App.vue` and `styles.css` around the full onboarding-to-completion flow, surfacing all seven category-first entries in product-realistic sequence instead of the earlier parallel card display.
- Updated `apps/docs/src/router.ts` to add the `onboarding-activation` route family.
- Updated `apps/docs/src/lib/copy.ts` and `RecipeDetailView.vue` for onboarding copy and detail page improvements.
- Expanded `admin-empty-states.spec.ts` with additional assertions.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run test:unit`
- `npm run test:ui`
- `npm run pack:check`

## 2026-04-23 Packaging Cleanup (Unreleased)

### Changed

- Excluded `*.test.ts` files from the shared and Vue package build tsconfig so test sources no longer emit into `dist`.
- Added a package-level prebuild cleanup step that removes stale `dist` output before rebuilding, so old test artifacts cannot leak into the next npm tarball.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run pack:check`

## 2026-04-22 Onboarding Category Pilot (Unreleased)

### Added

- Added `OnboardingState` as the seventh category-first public entry and introduced `onboarding-workspace` as the first dedicated onboarding recipe.
- Added `packages/vue/src/blocks/onboarding/OnboardingState.test.ts` so the onboarding entry now has explicit coverage for default rendering and override behavior.

### Changed

- Reframed `first-project` as an empty-state bridge for workspaces that already exist but still have no project, instead of treating it as the primary onboarding surface.
- Updated the shared shell, docs app, and `examples/vite-vue-admin` so the public product story now reads as `7` category-first entries backed by `19` preset recipes.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run test:unit`
- `npm run test:ui`
- `npm run pack:check`

## 2026-04-20 UI Test Coverage (Unreleased)

### Added

- Added `playwright.config.ts` plus `apps/docs/tests/admin-empty-states.spec.ts` to cover one `inline`, one `panel`, and one `page` docs scenario at the browser level.
- Added `vitest.config.ts`, `packages/vue/src/base/StateBlockShell.test.ts`, and `packages/vue/src/base/StatePresetBlock.test.ts` to cover CTA semantics, preset merge behavior, and unsupported layout fallback at the component level.

### Changed

- Added stable `data-testid` hooks to `apps/docs/src/views/examples/AdminEmptyStatesView.vue` so the docs example page can act as a reliable browser-level regression surface without changing the public package API.

### Verified

- `npm run test:unit`
- `npm run test:ui`
- `npm run typecheck`

## 2026-04-16 Release (0.2.1)

### Changed

- Bumped `@statekit-vue/shared` from `0.2.0` to `0.2.1`.
- Bumped `@statekit-vue/vue` from `0.2.0` to `0.2.1` and aligned its dependency on `@statekit-vue/shared` to `0.2.1`.
- Aligned `apps/docs` and `examples/vite-vue-admin` on the `0.2.1` workspace line for release verification.

### Published

- Published `@statekit-vue/shared@0.2.1`.
- Published `@statekit-vue/vue@0.2.1`.
- Confirmed the `0.2.1` release has been completed.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run pack:check`
- `npm run smoke:install`
- `npm run test:unit`
- `npm run test:ui`

## 2026-04-16 Design Refresh (Unreleased)

### Changed

- Redesigned `examples/vite-vue-admin` around a quieter, more editorial direction built from the six category-first public entries instead of the earlier admin-style card stack.
- Reworked `apps/docs/src/demo-styles.css` so the docs example pages now use more open section spacing, divider-led grouping, and lighter supporting chrome instead of stacked glass cards.
- Reduced card treatment across the docs shell in `apps/docs/src/styles.css`, including the homepage hero support area, recipe/detail/install outer containers, navigation chrome, and metadata treatments.
- Refined the shared state-shell illustrations in `packages/vue/src/base/StateBlockShell.vue` and `packages/vue/src/styles/base.css`: removed the success shadow line, centered the error cross, and rebalanced the permission lock.
- Kept the package API, preset metadata, and public component surface unchanged in this round. The work here is visual polish and documentation/example alignment only.

### Verified

- `npm run typecheck`
- `npm run build`

## 2026-04-06 Release (0.2.0)

### Added

- Added six category-first public Vue entry components: `EmptyState`, `LoadingState`, `ErrorState`, `PermissionState`, `UpgradeState`, and `SuccessState`.
- Kept the older scenario-specific exports as deprecated compatibility exports so existing consumers can migrate gradually instead of rewriting in one pass.

### Changed

- Reframed the public package surface around category-first entries backed by 18 preset recipes across six state categories.
- Renamed the docs app's primary route family from `/blocks` to `/recipes` and added redirects from the old `/blocks` URLs for compatibility.
- Renamed docs-internal helpers, data modules, and views from `block*` to `recipe*` so the docs codebase matches the current public terminology.
- Refreshed the root README, Chinese README, package README copy, and handoff notes to use the current category-first and recipe-first language consistently.
- Updated release metadata for `@statekit-vue/shared` and `@statekit-vue/vue`, including package descriptions and the `0.2.0` version line.
- Bumped `@statekit-vue/shared` and `@statekit-vue/vue` from `0.1.2` to `0.2.0`, and aligned workspace consumers on the same version line.

### Deprecated

- Scenario-specific component exports remain available, but new code should prefer the unified category-first entries.

### Published

- Published `@statekit-vue/shared@0.2.0`.
- Published `@statekit-vue/vue@0.2.0`.
- Confirmed both packages expose `0.2.0` on npm after release.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run pack:check`
- `npm run smoke:install`
- `npm view @statekit-vue/shared version`
- `npm view @statekit-vue/vue version`

## 2026-04-02 Release (0.1.2)

### Changed

- Published `@statekit-vue/shared@0.1.2` and `@statekit-vue/vue@0.1.2`.
- Finalized the CTA action object with `label`, `href`, `onClick`, `loading`, `loadingLabel`, and `disabled`.
- Added explicit `null` handling for `primaryAction` and `secondaryAction` so preset buttons can be removed intentionally.
- Updated docs, examples, and package pages to match the action API and install flow at the time of release.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run pack:check`
- `npm run smoke:install`

## 2026-04-02 Patch Release Prep (0.1.1)

### Changed

- Bumped `@statekit-vue/shared` from `0.1.0` to `0.1.1`.
- Bumped `@statekit-vue/vue` from `0.1.0` to `0.1.1` and aligned its dependency on `@statekit-vue/shared` to `0.1.1`.
- Updated the docs app, example app, and lockfile so the workspace resolved against the `0.1.1` line before publish.
