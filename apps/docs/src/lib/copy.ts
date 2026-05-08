import { stateBlockMetaList } from "@statekit-vue/shared";

export type Locale = "en" | "zh-CN";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-CN": "中文",
};

export const siteCopy = {
  en: {
    navAriaLabel: "Primary",
    languageAriaLabel: "Language",
    brandSubtext: "Vue State Docs",
    homeNav: "Home",
    recipesNav: "Recipes",
    examplesNav: "Examples",
    installNav: "Install",
  },
  "zh-CN": {
    navAriaLabel: "主导航",
    languageAriaLabel: "语言",
    brandSubtext: "Vue 状态文档",
    homeNav: "首页",
    recipesNav: "场景",
    examplesNav: "示例",
    installNav: "安装",
  },
} as const;

export const homeCopy = {
  en: {
    eyebrow: "Category-first State UI",
    title: "Category-first state components for Vue teams",
    description: `StateKit gives Vue teams seven public state categories with one shared API, backed by ${stateBlockMetaList.length} preset recipes for empty, onboarding, loading, error, permission, upgrade, and success moments.`,
    heroStats: {
      categories: "Category entries",
      recipes: "Preset recipes",
      featured: "Launch recipes",
    },
    browseRecipes: "Browse recipes",
    installation: "Installation",
    blueprintEyebrow: "Shared metadata",
    blueprintTitle: "Category-first components",
    blueprintDescription: `Seven public entries backed by ${stateBlockMetaList.length} preset recipes across empty, onboarding, loading, error, permission, upgrade, and success.`,
    coverageEyebrow: "Coverage",
    coverageTitle: "State categories that belong in the product surface",
    coverageDescription:
      "Every public category entry shares the same core API, while each recipe keeps its own default tone, placement, and user expectation.",
    launchEyebrow: "Launch Set",
    launchTitle: "Priority recipes teams usually need first",
    launchDescription:
      "These are the launch-tier recipes already marked as featured in the shared metadata layer.",
    examplesEyebrow: "Examples",
    examplesTitle: "See the recipes inside workflows, not just in isolation",
    examplesDescription:
      "Each example page places states back into a believable SaaS surface so spacing, hierarchy, and CTA tone can be evaluated in context.",
    startEyebrow: "Start",
    startTitle:
      "Install one category component, then rewrite only the product copy.",
    bottomInstallation: "Open installation guide",
    recipeCount: "recipes",
    entryLabel: "Entry",
  },
  "zh-CN": {
    eyebrow: "按状态类别设计的 UI",
    title: "给 Vue 团队用的状态界面组件",
    description: `StateKit 用一套共享 API 提供 7 个公开状态类别，并由 ${stateBlockMetaList.length} 个 preset recipes 覆盖 empty、onboarding、loading、error、permission、upgrade 和 success 这些 SaaS 产品时刻。`,
    heroStats: {
      categories: "公开类别入口",
      recipes: "预设场景",
      featured: "重点上线场景",
    },
    browseRecipes: "浏览场景",
    installation: "安装指南",
    blueprintEyebrow: "共享元数据",
    blueprintTitle: "Category-first 组件入口",
    blueprintDescription: `7 个公开入口由 ${stateBlockMetaList.length} 个 preset recipes 支撑，覆盖 empty、onboarding、loading、error、permission、upgrade 与 success。`,
    coverageEyebrow: "覆盖范围",
    coverageTitle: "应该出现在产品界面里的状态类别",
    coverageDescription:
      "每个公开类别入口共用同一套基础 API；不同 recipe 只负责提供默认语气、布局位置和用户预期。",
    launchEyebrow: "上线重点",
    launchTitle: "团队通常最先需要的一组 recipes",
    launchDescription:
      "这些是 shared 元数据里已经标记为 featured 的 launch 级场景。",
    examplesEyebrow: "示例",
    examplesTitle: "把 recipes 放回真实流程里看，而不是只看孤立展示",
    examplesDescription:
      "每个示例页都会把状态组件放进可信的 SaaS 界面里，方便一起检查间距、层级和 CTA 语气。",
    startEyebrow: "开始",
    startTitle: "先安装一个类别组件，再只改产品自己的文案。",
    bottomInstallation: "打开安装指南",
    recipeCount: "个场景",
    entryLabel: "入口",
  },
} as const;

export const recipeIndexCopy = {
  en: {
    eyebrow: "Recipe Index",
    title: "Preset recipes by state category",
    description: `Browse all ${stateBlockMetaList.length} preset recipes, compare adjacent moments inside the same category, and see which public category entry each recipe resolves through.`,
    totalRecipes: "Total recipes",
    launchPriority: "Launch priority",
    categories: "Categories",
    recipeSuffix: "recipes",
    sectionRecipeTitle: (label: string) => `${label} recipes`,
    entryLabel: "Entry",
  },
  "zh-CN": {
    eyebrow: "场景索引",
    title: "按状态类别组织的 preset recipes",
    description: `浏览全部 ${stateBlockMetaList.length} 个 preset recipes，对比同一类别里的相邻场景，并确认每个 recipe 最终通过哪个公开类别入口渲染。`,
    totalRecipes: "全部场景",
    launchPriority: "上线优先",
    categories: "状态类别",
    recipeSuffix: "个场景",
    sectionRecipeTitle: (label: string) => `${label}场景`,
    entryLabel: "入口",
  },
} as const;

export const installationSteps = {
  en: [
    "Install `@statekit-vue/vue` in the Vue 3.4+ workspace that renders the category components.",
    "Import `@statekit-vue/vue/styles.css` once before rendering any StateKit recipe.",
    "Import one category component from `@statekit-vue/vue` and override only the copy and CTA props you need.",
    "Install `@statekit-vue/shared` separately only when you need metadata or shared types without the Vue UI package.",
  ],
  "zh-CN": [
    "在负责渲染类别组件的 Vue 3.4+ workspace 里安装 `@statekit-vue/vue`。",
    "在渲染任何 StateKit recipe 之前，全局引入一次 `@statekit-vue/vue/styles.css`。",
    "从 `@statekit-vue/vue` 引入一个类别组件，然后只覆盖当前产品流程需要的文案和 CTA props。",
    "只有在不需要 Vue UI、只需要 metadata 或共享类型时，才单独安装 `@statekit-vue/shared`。",
  ],
} as const;

export const installationCopy = {
  en: {
    eyebrow: "Installation",
    title:
      "Start with one category component, then change only the product language.",
    description:
      "StateKit is meant to be low-decision: one package, one stylesheet, and seven public entries on top of shared recipe defaults.",
    facts: {
      package: "Package",
      stylesheet: "Stylesheet",
      steps: "Setup steps",
    },
    sections: [
      {
        index: "01",
        title: "Add the package",
        description:
          "Install the Vue package in the consuming Vue 3.4+ workspace where the category-first state components will render.",
      },
      {
        index: "02",
        title: "Import the shared stylesheet",
        description:
          "Pull in the default StateKit styles once in your app entry or page shell so every recipe rendered through a category component keeps the same shell and tone system.",
      },
      {
        index: "03",
        title: "Render one category component and override the copy",
        description:
          "After the stylesheet is in place, import one category component and change only the title, description, and CTA content that matters to the product flow.",
      },
    ],
    customizeTitle: "What you customize",
    customizeOptions: [
      "Title and description copy",
      "Tone, density, and layout",
      "Primary and secondary CTA labels",
    ],
    consistencyTitle: "What stays consistent",
    consistencyNotes: [
      "Shared metadata drives the default tone, density, layout, and action structure.",
      "Every category entry keeps the same underlying API, while recipes only change the defaults.",
      "The standard UI install only needs `@statekit-vue/vue`; add `@statekit-vue/shared` only for metadata and shared types.",
    ],
    checklistTitle: "Implementation checklist",
    browseRecipes: "Browse preset recipes",
  },
  "zh-CN": {
    eyebrow: "安装",
    title: "先从一个类别组件开始，再只改产品自己的语言。",
    description:
      "StateKit 的接入应该是低决策成本的：一个包、一份样式、7 个公开入口，以及 shared 元数据里的默认 recipe。",
    facts: {
      package: "安装包",
      stylesheet: "样式表",
      steps: "接入步骤",
    },
    sections: [
      {
        index: "01",
        title: "安装包",
        description:
          "在消费侧 Vue 3.4+ workspace 中安装 Vue 包，也就是实际渲染这些 category-first 状态组件的地方。",
      },
      {
        index: "02",
        title: "引入共享样式",
        description:
          "在应用入口或页面外壳里引入一次默认 StateKit 样式，让所有通过类别组件渲染的 recipe 保持一致的壳层、语气和按钮系统。",
      },
      {
        index: "03",
        title: "渲染一个类别组件并覆盖文案",
        description:
          "样式就位后，引入一个类别组件，只改当前产品流程真正需要的标题、描述和 CTA 内容。",
      },
    ],
    customizeTitle: "你通常会改什么",
    customizeOptions: [
      "标题和描述文案",
      "tone、density 和 layout",
      "主按钮与次按钮文案",
    ],
    consistencyTitle: "哪些保持一致",
    consistencyNotes: [
      "shared 元数据决定默认 tone、density、layout 和 action 结构。",
      "每个类别入口保留同一套底层 API，recipes 只改变默认值。",
      "标准 UI 接入只需要 `@statekit-vue/vue`；只有需要 metadata 和共享类型时才额外引入 `@statekit-vue/shared`。",
    ],
    checklistTitle: "实现检查清单",
    browseRecipes: "浏览 preset recipes",
  },
} as const;

export const examplePages = {
  en: [
    {
      href: "/examples/onboarding-activation",
      title: "Onboarding Activation",
      description:
        "Hero-style onboarding across workspace launch, teammate invite, and integration setup, with rich media, layered action slots, and lifecycle controlled entirely by the host page.",
    },
    {
      href: "/examples/admin-empty-states",
      title: "Admin Empty States",
      description:
        "Interactive empty states showing inline search recovery and a quieter single-CTA collection setup flow.",
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
  ],
  "zh-CN": [
    {
      href: "/examples/onboarding-activation",
      title: "首次引导激活",
      description:
        "用更强的 onboarding hero 串起创建工作区、邀请成员和连接集成，包含富媒体、分层 actions，并且生命周期完全由宿主页面控制。",
    },
    {
      href: "/examples/admin-empty-states",
      title: "后台空状态",
      description:
        "用可交互示例展示 inline 搜索恢复，以及更安静的单 CTA 集合创建流程。",
    },
    {
      href: "/examples/permissions-and-upgrade",
      title: "权限与升级",
      description:
        "围绕申请权限、会话恢复、禁用 CTA、配额限制和升级决策来展示权限与计费边界。",
    },
    {
      href: "/examples/task-flow",
      title: "任务流程",
      description:
        "串联 loading、error 和 success，展示自定义 loading 文案、原地重试、CTA 链接和完成后的交接动作。",
    },
  ],
} as const;
