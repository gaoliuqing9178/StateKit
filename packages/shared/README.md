# @statekit-vue/shared

Shared types and metadata for StateKit preset state blocks.

`@statekit-vue/shared` is the source-of-truth package behind StateKit. Use it when you need typed block ids, categories, layouts, tones, metadata lists, or lookup helpers without pulling in the Vue component layer.

## Install

```bash
npm install @statekit-vue/shared
```

## Quick Start

```ts
import {
  priorityStateBlocks,
  stateBlockMetaBySlug,
  stateBlockMetaList,
} from "@statekit-vue/shared";

console.log(stateBlockMetaList.length);
console.log(stateBlockMetaBySlug["empty-search-state"].componentName);
console.log(priorityStateBlocks.map((block) => block.id));
```

## What It Exports

- `StateBlockId`, `ImplementedBlockId`, `StateCategory`, `StateTone`, `StateDensity`, and `StateLayout`
- `StateAction`, `StateActionSlot`, `BaseStateProps`, and `StateBlockMeta`
- `stateBlockMetaList`, `stateBlockMetaById`, and `stateBlockMetaBySlug`
- `implementedBlockIds`, `priorityStateBlockIds`, `priorityStateBlocks`, and `isImplementedBlockId`

## Typical Uses

- Build docs tooling, block pickers, or internal registries from the same metadata used by the Vue package
- Drive analytics or routing from stable block ids and slugs
- Create custom wrappers around StateKit presets while keeping shared type safety

If you only want ready-to-use Vue components, install `@statekit-vue/vue` instead.

## Links

- Repository: https://github.com/gaoliuqing9178/StateKit
- Root docs and examples: https://github.com/gaoliuqing9178/StateKit#readme
- Release notes: https://github.com/gaoliuqing9178/StateKit/blob/main/CHANGELOG.md
