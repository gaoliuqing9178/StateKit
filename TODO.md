# StateKit TODO

这份清单只保留“还需要做”的执行项，按优先级排序。默认面向当前 V1 收口，而不是扩 scope。

## P0 发布前必须收口

- [x] 完成 `StateBlockShell` 的响应式人工 QA
  目标：确认 `inline`、`panel`、`page` 三种布局在 docs 和 example 中都可读，没有标题、描述、CTA 或详情卡片被遮挡、裁切或错位。
  重点宽度：`1700`、`1440`、`1280`、`1160`、`1120`、`1000`、`920`、`760`。
  重点页面：Blocks 详情页、`Admin Empty States`、`Permissions And Upgrade`、`Task Flow`、`examples/vite-vue-admin`。
  相关文件：`packages/vue/src/styles/base.css`、`apps/docs/src/styles.css`、`apps/docs/src/demo-styles.css`、`examples/vite-vue-admin/src/styles.css`。
  完成标准：桌面端和窄屏下都没有内容遮挡，CTA 可点击，loading/disabled 状态正常。

- [x] 重新启动 docs 和 example，做一次真实交互检查
  命令：
  
  ```bash
  npm run dev:docs
  npm run dev:example
  ```
  检查项：路由可访问、block 详情页正常渲染、example 场景不是占位内容、`href`/`onClick`/`loading`/`disabled`/`null` 移除按钮都符合预期。
  完成标准：docs 和 example 都能启动，主要页面无运行时报错。
  
- [x] 重新跑根级验证命令
  命令：
  ```bash
  npm run typecheck
  npm run build
  npm run pack:check
  npm run smoke:install
  ```
  说明：`typecheck` 和 `build` 之前通过过，但 `pack:check` 和 `smoke:install` 还没有在最新 docs/example 整理后重新跑。
  完成标准：四个命令全部通过，没有包导出、安装或构建回归。

- [x] 校对发布面文档和当前仓库状态
  需要对齐的文件：`README.md`、`README.zh-CN.md`、`CHANGELOG.md`、`剩餘部分.md`、`docs/statekit-ai-handoff-brief.md`、`docs/statekit-launch-checklist.md`。
  检查点：不要同时出现“README 已补齐”和“README 仍待补”这类冲突表述。
  完成标准：文档口径统一，当前已完成项、待完成项和技术边界一致。

- [x] 按 launch checklist 逐项勾选当前版本的真实状态
  目标文件：`docs/statekit-launch-checklist.md`
  做法：只勾已经验证过的项；没验证的保持未勾选，不要凭印象收口。
  完成标准：checklist 可以真实反映是否具备公开展示或发包条件。

## P1 短期应推进

- [x] 为关键 UI 增加最小可用的自动化回归测试
  建议先做最小闭环，不要一次铺太大：
  1. 为 `StateBlockShell` 增加 DOM 级断言，覆盖 `layout`、`tone`、`primaryAction`、`secondaryAction`、`href`、`loading`、`disabled`、`null`。
  2. 为 docs 关键路由增加截图级或快照级回归，至少覆盖一个 `inline`、一个 `panel`、一个 `page` 场景。
  完成标准：未来再改 CTA 或布局样式时，能自动发现明显回归。

- [x] 扩充 example 场景，而不是继续堆 Block 数量
  建议新增方向：多步骤任务流、权限受限后升级、数据为空后的首个成功闭环。
  完成标准：example 不只是组件陈列，而能展示更真实的产品接入方式。

- [x] 降低 docs 站手写映射的维护成本
  方向：梳理 `apps/docs/src/lib/block-docs.ts`、`apps/docs/src/lib/block-components.ts`、路由和 shared 元数据之间的重复映射。
  完成标准：新增或修改 Block 时，不需要在太多位置手工同步。

## P2 后续可评估

- [ ] 评估是否拆出独立 onboarding 类别
  当前 V1 仍由 `first-project` 等 first-run empty state 承担，不是阻塞项。
  完成标准：只有在确实出现多个 onboarding 专属场景、且元数据/视觉语义已明显不同于 `empty` 时再拆。

- [ ] 评估是否解耦“类别默认图形”和“个别 Block 专属图形”
  目标：提高后续定制能力，但不要破坏当前 shared metadata + preset block 的简单结构。
  完成标准：只有在现有图形复用开始明显限制表达时再推进。

## 明确不在当前 V1 范围内

- [ ] 不新增第三个 CTA
- [ ] 不引入复杂 slot 系统
- [ ] 不把 StateKit 扩成高度自由的页面搭建器
- [ ] 不对外暗示 React 或多框架支持

这些不是“待办未做完”，而是当前版本需要明确守住的边界。
