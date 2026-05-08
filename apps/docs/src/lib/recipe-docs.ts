/**
 * StateKit docs recipe 元数据读取层
 * 1. 作用：从 shared 包读取 recipe 元数据并重新导出，给 docs 页面提供统一的数据入口
 * 2. docs 站通过这个文件访问 recipe 列表和单个 recipe 详情，避免在各 view 里直接引用 shared
 * 3. 维护要点：shared 元数据是事实来源，这里只做转发，不要在这里手写任何 recipe 数据
 */

import {
  priorityStateBlocks as priorityStateRecipes,
  stateBlockMetaBySlug as stateRecipeMetaBySlug,
  stateBlockMetaList as stateRecipeMetaList,
} from "@statekit-vue/shared";

export const allRecipeDocs = stateRecipeMetaList;
export const featuredRecipeDocs = priorityStateRecipes;

export function getRecipeDocBySlug(slug: string) {
  return stateRecipeMetaBySlug[slug];
}
