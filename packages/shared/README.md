# @statekit/shared

Shared types and metadata for StateKit preset state blocks.

`@statekit/shared` is the source-of-truth layer behind StateKit. It exports block ids, categories, layout and tone types, metadata lists, and helpers used by framework packages and docs tooling.

## Install

```bash
npm install @statekit/shared
```

## Use

```ts
import { priorityStateBlocks, stateBlockMetaList } from "@statekit/shared";

console.log(stateBlockMetaList.length);
console.log(priorityStateBlocks.map((block) => block.id));
```

## Includes

- `StateBlockId`, `StateCategory`, `StateTone`, `StateDensity`, and `StateLayout`
- `stateBlockMetaList`, `stateBlockMetaById`, and `stateBlockMetaBySlug`
- `priorityStateBlockIds` and `priorityStateBlocks`

## More

- Repository: https://github.com/gaoliuqing9178/StateKit
- Root docs: https://github.com/gaoliuqing9178/StateKit#readme
- Release notes: https://github.com/gaoliuqing9178/StateKit/blob/main/CHANGELOG.md
