# StateKit Launch Checklist

这份清单用于 StateKit V1 对外发布前的最后收口。它默认面向第一次公开展示、开源发布或 npm 发布前的准备，而不是日常开发检查。

以下勾选基于当前仓库源码与本地命令结果；未勾选表示尚未逐项复核，不等于功能不存在。

## 1. 产品范围确认

- [x] 一句话定位已经统一为“面向 SaaS 产品的场景化状态界面组件库”。
- [x] 已确认 V1 范围只覆盖 Vue 3，不对外暗示 React 或多框架支持。
- [x] 已确认 onboarding 在 V1 中通过 `first-project` 等 first-run empty state 表达，而不是独立类别。
- [x] 已确认 launch 级 Block 清单与 `priorityStateBlockIds` 一致。

## 2. 包结构与导出

- [x] `@statekit-vue/shared` 的类型与元数据导出正常。
- [x] `@statekit-vue/vue` 能正常导出 6 个类别组件入口，并兼容导出全部 18 个 preset recipe 组件。
- [x] `@statekit-vue/vue/styles.css` 可被外部直接引入。
- [x] 根 workspace 的脚本能在当前环境中正常运行。

## 3. 文档准备

- [x] `docs/README.md` 已更新为当前版本，不再是占位索引。
- [x] `docs` 目录中的产品、规格、实现、QA 和发布文档已互相对齐。
- [x] 根 `README.md` 与 `README.zh-CN.md` 已按 README Outline 补齐。
- [x] 安装说明与实际包名、样式入口完全一致。

## 4. Docs 站准备

- [x] 首页文案准确表达 StateKit 的定位。
- [x] Block 列表页展示数量与 `stateBlockMetaList` 一致。
- [x] 所有 `slug` 对应的详情页都能访问。
- [x] Installation 页示例代码可直接使用。
- [x] Example 页至少覆盖 empty、permission / upgrade、task flow 三类组合场景。

## 5. 示例工程准备

- [ ] `examples/vite-vue-admin` 可启动。
- [ ] 示例工程里的 StateKit 接入看起来像真实产品，而不是单纯组件陈列。
- [x] 至少有一个空状态、一个限制状态和一个成功状态的落地示例。

## 6. 质量检查

- [x] 在根目录运行 `npm run typecheck` 通过。
- [x] 在根目录运行 `npm run build` 通过。
- [ ] `npm run dev:docs` 与 `npm run dev:example` 均可启动。
- [ ] 桌面端与移动端下，`inline`、`panel`、`page` 布局均可读。
- [ ] CTA、颜色语义、标题描述文案没有明显违和或占位痕迹。

## 7. 发布面准备

如果计划发布 npm 包，再额外检查：

- [x] `packages/shared/package.json` 与 `packages/vue/package.json` 中的名称、版本、导出字段正确。
- [x] 依赖与 peerDependencies 已校对。
- [x] 没有把内部 demo、dist 垃圾文件或错误路径当成发布内容。
- [x] 版本号策略和 changelog 方式已经确定。

当前 npm 发布状态：

- [x] `@statekit-vue/shared@0.1.2` 已发布且为 `public`
- [x] `@statekit-vue/vue@0.1.2` 已发布且为 `public`
- [x] 两个包的 `latest` dist-tag 当前都指向 `0.1.2`
- [x] 本地 workspace 当前版本为 `0.1.2`，与 npm 上最新可安装版本一致

如果只是开源仓库展示，可适当跳过 npm 发布细项，但文档和构建项不能跳。

## 8. 诚实披露

发布前应明确标注当前边界，而不是模糊处理：

- [x] 已说明当前没有自动化视觉回归测试。
- [x] 已说明 V1 主要通过 preset Block + shared metadata 组织，而不是高度自由的页面构建器。
- [x] 已说明当前是 Vue-first 实现。

## 9. 发布后首批跟进项

以下不属于“阻塞发布”，但发布后应尽快推进：

- [ ] 继续精炼根 README 的典型场景示例。
- [ ] 增加更多示例页面。
- [ ] 增加自动化测试或视觉回归。
- [ ] 评估是否拆出独立 onboarding 类别。
