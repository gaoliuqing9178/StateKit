# StateKit Changelog

## 2026-04-06 Release Prep (0.2.0)

### Added

- Added six category-first public Vue entry components: `EmptyState`, `LoadingState`, `ErrorState`, `PermissionState`, `UpgradeState`, and `SuccessState`.
- Kept the older scenario-specific exports as deprecated compatibility exports so existing consumers can migrate gradually instead of rewriting in one pass.

### Changed

- Reframed the public package surface around category-first entries backed by 18 preset recipes across six state categories.
- Renamed the docs app's primary route family from `/blocks` to `/recipes` and added redirects from the old `/blocks` URLs for compatibility.
- Renamed docs-internal helpers, data modules, and views from `block*` to `recipe*` so the docs codebase matches the current public terminology.
- Refreshed the root README, Chinese README, package README copy, and handoff notes to use the current category-first and recipe-first language consistently.
- Updated release metadata for `@statekit-vue/shared` and `@statekit-vue/vue`, including package descriptions and the next planned version line.
- Bumped `@statekit-vue/shared` and `@statekit-vue/vue` from `0.1.2` to `0.2.0`, and aligned workspace consumers on the same version line.

### Deprecated

- Scenario-specific component exports remain available, but new code should prefer the unified category-first entries.

### Verified

- `npm run typecheck`
- `npm run build`
- `npm run pack:check`
- `npm run smoke:install`

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
