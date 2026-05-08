import type { Locale } from "./copy";

export interface DetailFact {
  label: string;
  value: string;
}

export interface PropDoc {
  name: string;
  type: string;
  description: string;
  syntax: string[];
  current: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export const recipeDetailCopy = {
  en: {
    recipeLabel: "recipe",
    facts: {
      priority: "Priority",
      defaultLayout: "Default layout",
      layoutsSupported: "Layouts supported",
    },
    livePreview: "Live preview",
    metadataTitle: "Metadata",
    metadata: {
      slug: "Slug",
      publicEntry: "Public entry",
      priority: "Priority",
      layouts: "Layouts",
    },
    defaultsTitle: "Defaults",
    defaults: {
      tone: "Tone",
      density: "Density",
      layout: "Layout",
      defaultActions: "Default actions",
    },
    usageTitle: "Usage",
    guideEyebrow: "Guide",
    guideTitle: (componentName: string) =>
      `How to use ${componentName} for this recipe`,
    guideDescription:
      "Each recipe resolves through a category-first Vue component with the same base props. Start from this preset default, then customize only the content, layout, and CTA behavior your flow actually needs.",
    customizeTitle: "What to customize first",
    quickStartTitle: "Quick start example",
    quickStartDescription:
      "This is the fastest way to render this recipe through its public category component. It shows the component import, direct prop passing, and the default shell values for this recipe.",
    propsEyebrow: "Props",
    propsTitle: "How to customize content and pass parameters",
    propsDescription:
      "The same prop surface works across every category entry and recipe. The only thing that changes between recipes is the default copy, supported layouts, and action defaults coming from shared metadata.",
    passItAs: "Pass it as",
    currentDefault: "Current default:",
    slotsEyebrow: "Slots",
    slotsTitle: "Rich onboarding media and action areas",
    slotsDescription:
      "`OnboardingState` can stay simple for straightforward launch copy, but it also exposes two optional named slots for richer hero experiences across workspace setup, teammate invite, and initial integration flows. The page still owns visibility, skip behavior, and any persistence rules outside the component.",
    actionsEyebrow: "Actions",
    actionsTitle: "Buttons, links, loading, and click events",
    actionsDescription:
      "`primaryAction` and `secondaryAction` are where CTA behavior lives. Use them to define button labels, link targets, disabled state, loading state, and click handlers for this recipe.",
    typicalValue: "Typical value",
    note: "Note:",
    passingRulesTitle: "Passing rules that matter",
    relatedEyebrow: "Related",
    relatedTitle: "More recipes in the same category",
    relatedDescription:
      "Use these when the moment changes but the user still expects the same semantic family.",
    missingEyebrow: "Missing",
    missingTitle: "Recipe not found",
    missingDescription:
      "The requested slug does not match any recipe in the shared metadata.",
  },
  "zh-CN": {
    recipeLabel: "recipe",
    facts: {
      priority: "优先级",
      defaultLayout: "默认布局",
      layoutsSupported: "支持布局数",
    },
    livePreview: "实时预览",
    metadataTitle: "元数据",
    metadata: {
      slug: "Slug",
      publicEntry: "公开入口",
      priority: "优先级",
      layouts: "布局",
    },
    defaultsTitle: "默认值",
    defaults: {
      tone: "Tone",
      density: "Density",
      layout: "Layout",
      defaultActions: "默认操作",
    },
    usageTitle: "用法",
    guideEyebrow: "指南",
    guideTitle: (componentName: string) =>
      `如何把 ${componentName} 用在这个 recipe 里`,
    guideDescription:
      "每个 recipe 最终都会通过一个 category-first Vue 组件渲染，并共用同一套基础 props。先从 preset 默认值开始，再只改你的流程真正需要的内容、布局和 CTA 行为。",
    customizeTitle: "优先改哪些内容",
    quickStartTitle: "快速开始示例",
    quickStartDescription:
      "这是通过公开类别组件渲染该 recipe 的最快方式：包含组件 import、直接传 prop，以及这个 recipe 的默认壳层值。",
    propsEyebrow: "Props",
    propsTitle: "如何定制内容并传入参数",
    propsDescription:
      "每个类别入口和 recipe 都使用同一套 prop 表面。recipe 之间真正变化的是 shared 元数据里的默认文案、支持布局和 action 默认值。",
    passItAs: "传入方式",
    currentDefault: "当前默认值：",
    slotsEyebrow: "Slots",
    slotsTitle: "更丰富的 onboarding 媒体和操作区域",
    slotsDescription:
      "`OnboardingState` 可以保持简单，只承载直接的启动文案；也可以通过两个可选命名 slot 承载更强的 hero 体验，用在工作区设置、邀请成员和初始集成流程里。是否显示、跳过逻辑和持久化规则仍然属于页面本身。",
    actionsEyebrow: "Actions",
    actionsTitle: "按钮、链接、loading 和点击事件",
    actionsDescription:
      "`primaryAction` 和 `secondaryAction` 是 CTA 行为所在的位置。你可以在这里定义按钮文案、链接目标、禁用态、加载态和点击处理。",
    typicalValue: "常见写法",
    note: "说明：",
    passingRulesTitle: "需要注意的传参规则",
    relatedEyebrow: "相关",
    relatedTitle: "同一类别里的更多 recipes",
    relatedDescription:
      "当产品时刻发生变化，但用户仍然期待同一个语义家族时，可以参考这些 recipe。",
    missingEyebrow: "缺失",
    missingTitle: "没有找到这个 recipe",
    missingDescription: "当前 slug 没有匹配 shared 元数据中的任何 recipe。",
  },
} as const;

export const parameterRules: Record<Locale, readonly string[]> = {
  en: [
    "Use plain attributes for fixed strings and enum values, for example `title=\"...\"`, `tone=\"brand\"`, or `layout=\"panel\"`.",
    "Use `:` bindings whenever the value comes from a variable, `ref`, `computed`, object literal, boolean, or `null`.",
    "In Vue templates, prop names stay kebab-case: `primaryAction` becomes `primary-action`, and `secondaryAction` becomes `secondary-action`.",
    "Leaving `primaryAction` or `secondaryAction` undefined keeps the preset default. Passing `null` removes that default button explicitly.",
    "Put click behavior inside `primaryAction.onClick` or `secondaryAction.onClick`. Do not attach CTA handlers to the category component root.",
  ],
  "zh-CN": [
    "固定字符串和枚举值可以直接写普通 attribute，例如 `title=\"...\"`、`tone=\"brand\"` 或 `layout=\"panel\"`。",
    "只要值来自变量、`ref`、`computed`、对象字面量、布尔值或 `null`，就用 `:` 绑定。",
    "Vue 模板里的 prop 名保持 kebab-case：`primaryAction` 写成 `primary-action`，`secondaryAction` 写成 `secondary-action`。",
    "`primaryAction` 或 `secondaryAction` 不传时会沿用 preset 默认值；传 `null` 才表示明确移除默认按钮。",
    "点击行为放进 `primaryAction.onClick` 或 `secondaryAction.onClick`，不要把 CTA handler 挂到类别组件根节点上。",
  ],
};

export const actionFieldDocs: Record<Locale, PropDoc[]> = {
  en: [
    {
      name: "label",
      type: "string",
      description:
        "The button text shown to the user. This is the only required action field.",
      syntax: ['label: "Create project"'],
      current: "Required in every action object.",
    },
    {
      name: "href",
      type: "string | undefined",
      description:
        "When present, the action renders as a link instead of a button.",
      syntax: ['href: "/settings/billing"'],
      current: "Optional. Omit it when the action should stay a button.",
    },
    {
      name: "onClick",
      type: "(event: MouseEvent) => void | Promise<void>",
      description:
        "Use this for per-button click logic. It works for both button and link style actions.",
      syntax: ["onClick: handlePrimaryClick"],
      current: "Optional. Add it when the action should trigger local behavior.",
    },
    {
      name: "loading",
      type: "boolean | undefined",
      description:
        "Marks the action as busy. StateKit actions ignore repeat clicks and link navigation while loading is true.",
      syntax: ["loading: pending"],
      current: "Optional. Consumer state controls it.",
    },
    {
      name: "loadingLabel",
      type: "string | undefined",
      description:
        "Overrides the default loading text so the button can say exactly what is happening.",
      syntax: ['loadingLabel: "Creating project..."'],
      current: 'Falls back to "Working..." when omitted.',
    },
    {
      name: "disabled",
      type: "boolean | undefined",
      description:
        "Disables the action and applies the clearer gray state built into the shared shell.",
      syntax: ["disabled: isLocked"],
      current: "Optional. Use it when the action should be visible but unavailable.",
    },
  ],
  "zh-CN": [
    {
      name: "label",
      type: "string",
      description: "展示给用户看的按钮或链接文案。这是 action 里唯一必填字段。",
      syntax: ['label: "创建项目"'],
      current: "每个 action 对象都必须提供。",
    },
    {
      name: "href",
      type: "string | undefined",
      description: "传入后，这个 action 会渲染成链接，而不是普通按钮。",
      syntax: ['href: "/settings/billing"'],
      current: "可选。需要保持按钮语义时不要传。",
    },
    {
      name: "onClick",
      type: "(event: MouseEvent) => void | Promise<void>",
      description: "用于单个按钮的点击逻辑。按钮和链接样式 action 都可以使用。",
      syntax: ["onClick: handlePrimaryClick"],
      current: "可选。需要触发页面本地行为时再加。",
    },
    {
      name: "loading",
      type: "boolean | undefined",
      description:
        "把 action 标记为忙碌状态。loading 为 true 时，StateKit 会阻止重复点击和链接跳转。",
      syntax: ["loading: pending"],
      current: "可选。由消费侧状态显式控制。",
    },
    {
      name: "loadingLabel",
      type: "string | undefined",
      description: "覆盖默认 loading 文案，让按钮准确说明当前正在发生什么。",
      syntax: ['loadingLabel: "正在创建项目..."'],
      current: "省略时回退到 `Working...`。",
    },
    {
      name: "disabled",
      type: "boolean | undefined",
      description: "禁用 action，并应用 shared shell 内置的清晰灰态。",
      syntax: ["disabled: isLocked"],
      current: "可选。动作需要可见但不可用时使用。",
    },
  ],
};

export const onboardingSlotDocs: Record<Locale, PropDoc[]> = {
  en: [
    {
      name: "#media",
      type: "slot",
      description:
        "Use for richer onboarding visuals such as product mockups, GIFs, or video. Keep the default shell when a recipe only needs a clear launch message, and switch to `#media` when the first-run surface must preview the product shape or activation steps.",
      syntax: ["<template #media>...</template>"],
      current: "Optional.",
    },
    {
      name: "#actions",
      type: "slot",
      description:
        "Use when the default two-button pattern is not enough and the page needs tutorial links, demo-data entry points, or a low-priority skip affordance. Visibility, skip rules, and persistence should still stay in the host page.",
      syntax: ["<template #actions>...</template>"],
      current: "Optional.",
    },
  ],
  "zh-CN": [
    {
      name: "#media",
      type: "slot",
      description:
        "用于更丰富的 onboarding 视觉，比如产品 mockup、GIF 或视频。recipe 只需要清晰启动文案时保留默认壳层；首次进入界面需要预览产品形态或激活步骤时，再切到 `#media`。",
      syntax: ["<template #media>...</template>"],
      current: "可选。",
    },
    {
      name: "#actions",
      type: "slot",
      description:
        "默认双按钮不够用时再用，比如页面需要教程链接、demo 数据入口，或一个低优先级的跳过动作。显示规则、跳过规则和持久化仍然应该留在宿主页面里。",
      syntax: ["<template #actions>...</template>"],
      current: "可选。",
    },
  ],
};
