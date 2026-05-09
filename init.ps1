# StateKit 开发环境初始化（Windows）

# 用途：让新接手的 agent 或开发者一条命令恢复 StateKit 开发环境。
# 用法：在仓库根目录执行 .\init.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "StateKit 开发环境初始化" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 Node.js。请先安装 Node.js >= 18。" -ForegroundColor Red
    exit 1
}

# 检查 npm
Write-Host "检查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 npm。" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 安装依赖
Write-Host "安装依赖（npm install）..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [错误] npm install 失败。" -ForegroundColor Red
    exit 1
}
Write-Host "  依赖安装完成。" -ForegroundColor Green

Write-Host ""

# 快速验证
Write-Host "运行快速验证（lint:boundaries + typecheck + test:unit + build）..." -ForegroundColor Yellow
npm run verify:fast
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [警告] verify:fast 未全部通过。请检查上方输出。" -ForegroundColor Yellow
} else {
    Write-Host "  verify:fast 通过。" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "初始化完成。" -ForegroundColor Cyan
Write-Host ""
Write-Host "常用命令：" -ForegroundColor White
Write-Host "  npm run dev:docs         启动文档站开发服务器（http://127.0.0.1:4173）"
Write-Host "  npm run dev:example      启动示例 app 开发服务器（http://127.0.0.1:4273）"
Write-Host "  npm run verify:fast      快速验证（边界 lint + 类型检查 + 单元测试 + 构建）"
Write-Host "  npm run verify:release   发布前完整验证（含 UI 测试、包检查、烟测）"
Write-Host ""
Write-Host "UI 测试说明（Codex 环境）：" -ForegroundColor Yellow
Write-Host "  npm run test:ui 会自动启动 docs 和 example 开发服务器并执行 Playwright 测试。"
Write-Host "  如果当前 agent 是 Codex，UI 测试和 Browser MCP 检查需要由宿主环境另起一个新的"
Write-Host "  Codex 终端来执行（见 docs/statekit-agent-harness.md 第 4 节）。"
Write-Host "  不要让同一个编码 agent 自己写代码又自己跑 Browser MCP 测试。"
Write-Host ""
Write-Host "先读文件：" -ForegroundColor White
Write-Host "  AGENTS.md                agent 入口地图"
Write-Host "  feature_list.json        功能清单和验收状态"
Write-Host "  progress.md              轮次进度记录"
Write-Host "  docs/statekit-ai-handoff-brief.md  当前项目状态"
Write-Host ""
