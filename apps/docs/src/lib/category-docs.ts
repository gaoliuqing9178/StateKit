import {
  stateBlockMetaList,
  type StateCategory,
} from "@statekit-vue/shared";
import type { Locale } from "./copy";

export interface CategoryDocCopy {
  label: string;
  description: string;
  listDescription: string;
  customizationGuide: string;
}

export interface CategoryDocSection extends CategoryDocCopy {
  category: StateCategory;
  count: number;
}

export const categoryOrder = stateBlockMetaList.reduce<StateCategory[]>(
  (categories, recipe) => {
    if (!categories.includes(recipe.category)) {
      categories.push(recipe.category);
    }

    return categories;
  },
  [],
);

export const categoryDocs = {
  en: {
    empty: {
      label: "Empty",
      description:
        "Blank collections and empty searches that still need a clear next move.",
      listDescription:
        "Blank collections and empty searches that still need the next step.",
      customizationGuide:
        "Rewrite the copy so the user understands what is missing, why the surface is still empty, and what they should create or clear next.",
    },
    onboarding: {
      label: "Onboarding",
      description:
        "First-run activation and setup moments before the team reaches the real workspace.",
      listDescription:
        "First-run activation states that start the workspace before content exists.",
      customizationGuide:
        "Keep the message activation-shaped. Good onboarding copy explains the first setup action plainly and makes the next step feel safe, not overwhelming.",
    },
    loading: {
      label: "Loading",
      description:
        "Processing states that keep structure visible while the system catches up.",
      listDescription:
        "States that hold structure while content is still arriving.",
      customizationGuide:
        "Keep the title and description procedural. Loading recipes work best when they confirm progress and avoid adding unnecessary secondary actions.",
    },
    error: {
      label: "Error",
      description:
        "Recoverable and blocking failures with the right amount of urgency.",
      listDescription:
        "Failures that need retry, recovery, or a safe way out.",
      customizationGuide:
        "Use direct recovery language. The title should name the failure plainly, and the primary action should map to the safest retry path.",
    },
    permission: {
      label: "Permission",
      description:
        "Role limits, access gates, and expired sessions that read as product rules.",
      listDescription:
        "Access restrictions tied to role, resource, or session state.",
      customizationGuide:
        "Explain the boundary clearly. Good permission copy says who can act, what is restricted, and whether the user should request access or go back.",
    },
    upgrade: {
      label: "Upgrade",
      description:
        "Plan and quota moments that guide a decision without turning into marketing.",
      listDescription:
        "Quota and plan gates that still read like product flow.",
      customizationGuide:
        "Keep the business message product-shaped. Focus on what unlocks next, not on marketing slogans or generic upsell copy.",
    },
    success: {
      label: "Success",
      description:
        "Completion states that close the loop and point to the next useful action.",
      listDescription:
        "Completion moments that keep momentum after the task ends.",
      customizationGuide:
        "Treat this as a completion checkpoint. Confirm what finished, then make the next meaningful action obvious through the primary button.",
    },
  },
  "zh-CN": {
    empty: {
      label: "空状态",
      description: "还没有内容、搜索为空、筛选无结果，但用户仍然需要下一步。",
      listDescription: "集合为空、搜索无结果或筛选为空时，继续给用户明确下一步。",
      customizationGuide:
        "先把文案改到用户能明白缺了什么、为什么当前界面还是空的，以及下一步应该创建什么或清除什么。",
    },
    onboarding: {
      label: "首次引导",
      description:
        "团队真正进入工作区之前，负责首次启动、激活和初始配置的引导状态。",
      listDescription: "内容出现之前，用首次启动状态把团队带进真实工作区。",
      customizationGuide:
        "保持激活语气。好的 onboarding 文案会把第一个设置动作讲清楚，让下一步显得可控，而不是压迫感很强。",
    },
    loading: {
      label: "加载中",
      description: "系统还在处理时保留页面结构，让用户知道事情正在推进。",
      listDescription: "内容还在到达时，保留结构并减少等待的不确定感。",
      customizationGuide:
        "标题和描述要偏流程化。loading recipe 最适合确认进度，不要随手加没必要的次按钮。",
    },
    error: {
      label: "错误恢复",
      description:
        "可恢复或阻断性的失败状态，需要用合适的紧急程度给出恢复路径。",
      listDescription: "需要重试、恢复或安全退出的失败状态。",
      customizationGuide:
        "直接写恢复路径。标题要清楚说出失败，主操作要对应最安全的重试或回退方式。",
    },
    permission: {
      label: "权限限制",
      description:
        "角色限制、访问门禁和登录态过期，语气上更像产品规则而不是崩溃。",
      listDescription: "和角色、资源、会话有关的访问限制。",
      customizationGuide:
        "把边界解释清楚。好的权限文案会说明谁可以操作、当前限制是什么、用户应该申请权限还是返回。",
    },
    upgrade: {
      label: "升级引导",
      description: "套餐和配额限制，引导用户做决定，但不要变成营销广告。",
      listDescription: "配额、套餐和商业边界，但仍然要像产品流程。",
      customizationGuide:
        "商业信息也要像产品流程。重点写升级后能继续做什么，不要写成泛泛的营销口号。",
    },
    success: {
      label: "成功完成",
      description: "任务完成后的收口状态，确认结果并指向下一个有用动作。",
      listDescription: "任务结束后保持行动节奏的完成状态。",
      customizationGuide:
        "把它当作完成检查点。先确认什么完成了，再通过主按钮指出下一个有意义的动作。",
    },
  },
} as const satisfies Record<Locale, Record<StateCategory, CategoryDocCopy>>;

export function getCategoryDoc(locale: Locale, category: StateCategory) {
  return categoryDocs[locale][category];
}

export function getCategorySections(locale: Locale): CategoryDocSection[] {
  return categoryOrder.map((category) => ({
    category,
    count: stateBlockMetaList.filter((recipe) => recipe.category === category)
      .length,
    ...getCategoryDoc(locale, category),
  }));
}

export function getCategoryLabel(locale: Locale, category: StateCategory) {
  return getCategoryDoc(locale, category).label;
}

export function getCategoryCustomizationGuide(
  locale: Locale,
  category: StateCategory,
) {
  return getCategoryDoc(locale, category).customizationGuide;
}
