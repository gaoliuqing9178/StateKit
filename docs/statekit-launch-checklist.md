# StateKit Launch Checklist

这份清单用于 StateKit 对外发布前的最后收口。当前这一版按 `0.3.0` minor 发版准备状态更新。

## 1. 产品范围确认

- [x] 一句话定位保持为"面向 SaaS 产品的 category-first 状态 UI 组件库"
- [x] 当前只对外承诺 Vue 3 支持，不暗示 React 或多框架
- [x] 公开主入口已经扩到 7 个 category-first 组件
- [x] onboarding 已作为独立类别引入，不再默认混在 empty 里

## 2. 包结构与导出

- [x] `@statekit-vue/shared` 的导出、类型入口和构建脚本正确
- [x] `@statekit-vue/vue` 的导出、样式入口和 peerDependencies 正确
- [x] `@statekit-vue/vue` 对 `@statekit-vue/shared` 的依赖已同步到 `0.3.0`
- [x] `apps/docs` 和 `examples/vite-vue-admin` 已对齐到 `0.3.0`
- [x] 构建产物已排除 `*.test.ts`，tarball 不含测试产物

## 3. 文档准备

- [x] README 与 package README 已反映 category-first API
- [x] 当前交接入口维护在 `docs/handoff.md`，历史轮次维护在 `progress.md`
- [x] release-facing `CHANGELOG.md` 已可访问
- [x] `feature_list.json`、handoff 和 launch checklist 已更新到当前版本状态

## 4. Docs 站准备

- [x] 首页、recipes、recipe detail、installation 和 examples 页面都仍可构建
- [x] docs 示例页已同步第一轮"去卡片化"视觉收口
- [x] docs 首页、recipes 和 recipe detail 已同步 onboarding category 的 7 类口径
- [x] `/examples/onboarding-activation` 已上线，展示完整 first-run 激活流程和 3 个 onboarding recipes
- [x] `/examples` 默认重定向到 `/examples/onboarding-activation`
- [x] Playwright 自动化覆盖主路径 + 移动端断点 + 中文 locale + example 集成面（12 个 spec 文件）
- [ ] 人工浏览 docs 首页、`/recipes`、`/recipes/:slug`、`/examples/onboarding-activation` 和其余三个 example 页
- [ ] 人工检查移动端留白、分隔线、hover 强度和 CTA 节奏

## 5. Example 工程准备

- [x] `examples/vite-vue-admin` 已重做为 onboarding-to-completion 流程叙事，覆盖全部 7 个 category-first 入口
- [x] 示例页不依赖旧场景名 API
- [ ] 人工确认 example 页在桌面和移动端都没有视觉失衡

## 6. 共享图形检查

- [x] `SuccessState` 已移除 `sk-figure__shadow-line`
- [x] `ErrorState` 的 cross 已居中
- [x] `PermissionState` 的 lock 已重新居中
- [ ] 人工确认三组图形在 `inline` / `panel` / `page` 下都协调

## 7. 质量检查

- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run test:unit`
- [x] `npm run test:ui`
- [x] `npm run pack:check`
- [ ] `npm run smoke:install`（需在下一次发版口径定稿后再补跑）

## 8. npm 发布状态

- [x] npm 上最新已发布版本仍是 `0.2.1`
- [x] 本地 workspace 已切到 `0.3.0` release-prep 版本线
- [x] onboarding category pilot 已决定按 `0.3.0` minor 发布
- [ ] 发布包含 onboarding category 的下一次版本
- [ ] 发布后确认两个包的 `latest` dist-tag 指向新的版本号

## 9. 发布后跟进

- [ ] `npm view @statekit-vue/shared version`
- [ ] `npm view @statekit-vue/vue version`
- [ ] 更新交接文档里的"已发布状态"
- [ ] 继续补视觉回归或截图测试（优先：onboarding、error、permission、success 图形）
