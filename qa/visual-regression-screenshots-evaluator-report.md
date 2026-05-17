# visual-regression-screenshots Evaluator Report

## 范围

- 验收 `feature_list.json` 中 `visual-regression-screenshots` 条目。
- 审查 Builder 已修改/新增的文件：
  - `playwright.config.ts`
  - `apps/docs/tests/visual-regression-screenshots.spec.ts`
  - `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/*.png`
- 本轮 Evaluator 未修改实现、测试或基线文件；只新增本报告。

## 验证命令

```powershell
.\node_modules\.bin\playwright.cmd test apps/docs/tests/visual-regression-screenshots.spec.ts
```

结果：PASS，3 passed。

```powershell
npm run verify:ui
```

结果：PASS，39 passed。

控制台抽查使用宿主环境启动 docs dev server，并用 Playwright `page.on('console')` / `page.on('pageerror')` 检查三条目标路由。首次用 `Start-Process -FilePath "npm.cmd"` 启动失败，原因是 sandbox 无法解析 `npm.cmd`；随后改用实际宿主路径 `C:\nvm4w\nodejs\npm.cmd` 并提升权限后抽查成功。

## 代码与基线审查

### 覆盖目标

- error cross 居中：已覆盖。
  - `keeps the error cross centered in the figure` 打开 `/recipes/page-error-state`。
  - 对 `.sk-figure__cross` 和 `.sk-figure__cross.is-secondary` 都执行了相对 `.sk-figure--error` 的 X/Y 中心点断言。
  - 同时对 `.sk-shell__media-frame` 截图比对 `error-cross-centered.png`。

- permission lock 居中：已覆盖。
  - `keeps the permission lock centered in the figure` 打开 `/recipes/no-permission-state`。
  - 对 `.sk-figure__lock-body` 和 `.sk-figure__lock-arch` 都执行了相对 `.sk-figure--permission` 的 X 轴中心点断言。
  - 额外断言 arch 位于 body 上方且与 body 连接关系合理。
  - 同时对 `.sk-shell__media-frame` 截图比对 `permission-lock-centered.png`。

- success 无 shadow line：已覆盖。
  - `keeps success figures free of the old shadow line` 打开 `/recipes/task-success-state`。
  - 明确断言 `.sk-figure__shadow-line` 数量为 0。
  - 同时对 `.sk-shell__media-frame` 截图比对 `success-without-shadow-line.png`。

### CI 可重复性措施

- 固定 viewport：已覆盖。`openRecipeFigure` 每次设置 `{ width: 1280, height: 900 }`。
- 只截 media frame：已覆盖。截图目标是 `preview.locator(".sk-shell__media-frame")`，没有截整页。
- 禁用动画/caret：已覆盖。
  - `toHaveScreenshot` options 使用 `animations: "disabled"` 和 `caret: "hide"`。
  - `page.emulateMedia({ reducedMotion: "reduce" })`。
  - 注入 `deterministicRenderingStyle`，把 animation/transition duration 与 delay 归零，并隐藏 caret color。
- 等待字体 ready：已覆盖。`await page.evaluate(() => document.fonts.ready.then(() => true));`。
- snapshotPathTemplate 不带平台后缀：已覆盖。`playwright.config.ts` 使用 `{testDir}/__screenshots__/{testFilePath}/{arg}{ext}`，没有 `{projectName}`、`{platform}` 或 OS 后缀。
- 字体抗锯齿容忍：已覆盖基本容忍。截图 options 使用 `scale: "css"`、`threshold: 0.08`、`maxDiffPixelRatio: 0.002`。

### 基线文件

已看到三张基线文件：

- `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/error-cross-centered.png`
- `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/permission-lock-centered.png`
- `apps/docs/tests/__screenshots__/visual-regression-screenshots.spec.ts/success-without-shadow-line.png`

截图 spec 在本机复跑通过，说明当前基线与实现匹配。

## 控制台日志审查

抽查方式：Playwright 打开 docs dev server，对每条路由注册 `page.on('console')` 和 `page.on('pageerror')`，只统计 `console.error`、`console.warning` 和 `pageerror`。

| 路由 | console error | console warning | pageerror | 结论 |
| --- | ---: | ---: | ---: | --- |
| `/recipes/page-error-state` | 0 | 0 | 0 | PASS |
| `/recipes/no-permission-state` | 0 | 0 | 0 | PASS |
| `/recipes/task-success-state` | 0 | 0 | 0 | PASS |

未发现阻塞性控制台错误或警告。

## 风险与跟进

- 该截图覆盖面聚焦在三个已知视觉回归点，范围合理；它不是全组件视觉快照矩阵。
- 当前只在 Playwright 配置中的 Chromium desktop project 下运行。考虑到本条目标是 CI 可重复的回归保护，而不是跨浏览器视觉验收，这个范围可以接受。
- `snapshotPathTemplate` 去掉平台后缀后，未来如果新增多浏览器/多 viewport project，需要重新规划基线路径，避免不同 project 共用同名截图。
- 当前 `feature_list.json` 仍为 `passes: false`，报告放行后应由 Builder/主流程再补 `evaluator` 与 `evidence` 字段，不应由本 Evaluator 越界修改。

## 放行建议

PASS。

理由：目标三处视觉修复点均有几何断言与截图基线保护；CI 可重复性措施完整；针对性截图测试和完整 `verify:ui` 均通过；三条目标路由 console/pageerror 抽查均为 0。
