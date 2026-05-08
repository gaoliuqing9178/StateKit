# StateKit TODO

这份清单只保留当前还需要推进的事项。现在的重点已经从确认版本口径转为 `0.3.0` 发版验证与发布：

1. 把 `onboarding` category pilot 收到可发布状态。
2. 继续增加高价值场景组件 / preset recipes，让覆盖率真正往前走。
3. 在扩展过程中守住 StateKit 的边界，不把它做成失控的大杂烩。

## P0 近期必须收口

- [x] 为 `onboarding` category pilot 确定下一次版本号与发布口径
  结论：按 minor 版本 `0.3.0` 处理。
  原因：新增独立 category-first 入口 `OnboardingState`，并把 onboarding recipe family 从 1 个试点扩到 3 个可展示场景，属于公开能力扩展，不再按 patch 尾声处理。
  需要同步的文件：`README.md`、`README.zh-CN.md`、`packages/vue/README.md`、`docs/statekit-ai-handoff-brief.md`、`docs/statekit-launch-checklist.md`、`docs/交接/CHANGELOG.md`、`docs/交接/剩餘部分.md`。
  完成标准：对外文档、交接文档和最终版本号口径一致，不再出现"代码里已经有 onboarding，但发布说明还像 0.2.1 patch 尾声"的割裂表述。

- [x] 补一次围绕 `onboarding` 的人工 QA
  目标：确认新增的第 7 类状态在 docs 和 example 里是"语义更清楚"，而不是只是多了一个名字。
  重点页面：`/`、`/recipes`、`/recipes/onboarding-workspace-state`、`/recipes/onboarding-members-state`、`/recipes/onboarding-integration-state`、`/examples/onboarding-activation`、`/examples/admin-empty-states`、`examples/vite-vue-admin`。
  重点宽度：`1700`、`1440`、`1280`、`1160`、`1000`、`760`。
  检查点：`OnboardingState` 的图形、标题节奏、CTA 层级、移动端按钮堆叠、以及它和 `EmptyState` / `first-project` 的语义边界是否足够清楚。
  完成标准：从首页到详情页到示例页，用户能直观看出"onboarding 不是 generic empty state"。

- [x] 在最终发版前重新跑完整发布链路
  命令：
  ```bash
  npm run typecheck
  npm run build
  npm run test:unit
  npm run test:ui
  npm run pack:check
  npm run smoke:install
  ```
  说明：当前 `typecheck`、`build`、`test:unit`、`test:ui`、`pack:check` 已为最新这轮重新验证过，但 `smoke:install` 还需要在最终发版口径定稿后再补一次。
  完成标准：六个命令全部通过，并且结果与交接文档一致。

## P1 下一阶段最值得推进

- [x] 把 `onboarding` 从 1 个试点 recipe 扩成最小闭环
  已完成：当前已有 `onboarding-workspace`、`onboarding-members`、`onboarding-integration` 三个 recipe。
  docs 示例页已补强 recipe-level 展示和跳转覆盖，`OnboardingState` 不再只对应"创建 workspace"这一个瞬间，而能覆盖 first-run 激活链路里最常见的几个节点。

- [x] 先做"场景缺口矩阵"，再决定下一批新增组件
  已完成：`docs/statekit-scenario-gap-matrix.md` 已补齐 `category × 用户阶段（start / operate / blocked / recover / finish）` 矩阵，并明确哪些高频场景已经有 recipe、哪些缺口值得补、哪些只需要文案覆盖。
  完成标准：下一批扩展有一张可复用的缺口表，而不是每次重新拍脑袋。

- [x] 新增场景时，优先扩 recipe 覆盖率，而不是继续膨胀顶层公开入口
  已完成：docs 站分类说明已收口到 `apps/docs/src/lib/category-docs.ts`，首页、recipes 列表和 detail 都改为从同一份 docs-local 分类数据读取；扩展新场景时，先同步 shared recipe，再让 docs 自动消费，而不是再手写一套分类文案。
  完成标准：新增场景后，公开 API 仍然清楚，不会退回到"每个场景一个公开组件名"的旧路径。

- [x] 扩 docs / example 的产品上下文，而不是只在 metadata 里增加 recipe
  已完成：新增了 `OnboardingActivationView.vue`，串联了完整 first-run 流程（workspace → 成员 → 集成 → 完成）；`examples/vite-vue-admin` 已重做为 onboarding-to-completion 叙事线。
  下一步：可继续把 `/examples/permissions-and-upgrade` 和 `/examples/task-flow` 串成更完整的"阻断 → 完成"路径。

- [x] 把 UI 自动化覆盖扩到更多示例页和主路径
  已完成：新增 `home-featured-recipes`、`installation-navigation`、`mobile-layout`、`onboarding-activation`、`recipe-detail-paths`、`chinese-locale` 等 spec 文件，当前共 11 个 Playwright spec，覆盖了所有主路径、移动端断点和中文 locale 导航。
  剩余：`/examples/permissions-and-upgrade` 和 `/examples/task-flow` 已有 spec，确认断言密度是否足够。

- [x] 给 docs 站补中文版本
  已完成：新增 `/zh-CN` 路由家族，覆盖首页、recipes、recipe 详情、安装页和示例页入口；顶部语言切换可在英文和中文之间保留当前页面。
  边界：中文 recipe 展示层在 docs 本地维护，不改 `packages/shared` 的真实默认 metadata；slug、组件名、priority、layout 等 API 事实保持英文/代码原样。
  已验证：`npm run typecheck --workspace @statekit/docs`、`npm run test:ui`、`npm run build --workspace @statekit/docs`。

- [ ] 继续减少 docs 站的手写分类文案与维护点
  当前 recipe 列表和详情页虽然已经主要吃 shared 元数据，但首页分类说明、部分 usage copy 仍然是手写维护。
  目标：在不把 shared 搞得过重的前提下，继续减少"新增一个 recipe / category 时需要手动改很多地方"的成本。
  完成标准：新增 recipe 或调整 category 文案时，docs 同步点进一步减少。

## P2 后续可评估

- [ ] 评估是否需要在 `onboarding` 之后继续新增第 8 类 category
  原则：只有当多个高频场景都已经明显不适合 `empty / onboarding / loading / error / permission / upgrade / success` 任一语义时再拆。
  目标：避免为了多几个组件而把类别体系越拆越碎。

- [ ] 评估是否解耦"类别默认图形"和"个别 recipe 专属图形"
  目标：提高后续定制能力，但不要破坏当前 shared metadata + preset block 的简单结构。
  当前最值得关注的不是全部 recipe，而是 `onboarding`、`upgrade`、`success` 这些更容易需要专属语义图形的类别。
  完成标准：只有在现有图形复用开始明显限制表达时再推进。

## 明确不在当前范围内

- 不新增第三个 CTA
- 不引入复杂 slot 系统
- 不把 StateKit 扩成高度自由的页面搭建器
- 不对外暗示 React 或多框架支持
- 不为每个新增 recipe 都额外暴露一个新的公开入口组件

这些不是"忘了做"，而是当前版本必须明确守住的边界。
