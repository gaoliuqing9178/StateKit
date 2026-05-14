#Requires -Version 5.1
<#
.SYNOPSIS
  StateKit 验证链 —— 任一步失败即退出。

.DESCRIPTION
  PowerShell 单一门禁。串行跑：
    1. lint:boundaries（机械依赖边界）
    2. typecheck（四个 workspace）
    3. test:unit（vitest）
    4. build（shared / vue / docs / example）
    5. test:ui（playwright，含 docs + example app）
    6. pack:check（npm pack --dry-run）
    7. smoke:install（外部消费者烟测）

  使用方式：
    .\verify.ps1            # 默认 release 级，七步全跑
    .\verify.ps1 -Mode fast # 跳过 5/6/7（等价 npm run verify:fast）
    .\verify.ps1 -Mode ui   # 跳过 6/7

  完成定义：对应模式的全部步骤绿 + 末行 "VERIFY OK"。

.NOTES
  对应 docs/quality.md §9 的 verify 命令分层。
  任一步失败立即非零退出，避免后续 agent 在坏环境继续往下跑。
#>

param(
  [ValidateSet('fast', 'ui', 'release')]
  [string]$Mode = 'release'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

function Write-Step {
  param([int]$Index, [int]$Total, [string]$Name, [string]$Cmd)
  Write-Host ""
  Write-Host "▎ Step $Index/$Total · $Name" -ForegroundColor Cyan
  Write-Host "  > $Cmd"
}

function Run-Step {
  param([int]$Index, [int]$Total, [string]$Name, [string]$Cmd)
  Write-Step $Index $Total $Name $Cmd
  & cmd /c $Cmd
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[verify.ps1] 步骤失败：$Name" -ForegroundColor Red
    Write-Host "[verify.ps1] 提示：见 docs/runbooks/debug.md" -ForegroundColor Yellow
    exit $LASTEXITCODE
  }
}

switch ($Mode) {
  'fast'    { $total = 4 }
  'ui'      { $total = 5 }
  'release' { $total = 7 }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "StateKit verify · mode=$Mode · steps=$total" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Run-Step 1 $total 'Workspace 边界 lint'   'npm run lint:boundaries'
Run-Step 2 $total 'TypeScript 类型检查'    'npm run typecheck'
Run-Step 3 $total 'Vitest 单元测试'        'npm run test:unit'
Run-Step 4 $total 'Vite 构建'              'npm run build'

if ($Mode -ne 'fast') {
  Run-Step 5 $total 'Playwright UI 测试' 'npm run test:ui'
}

if ($Mode -eq 'release') {
  Run-Step 6 $total 'pack:check'         'npm run pack:check'
  Run-Step 7 $total 'smoke:install'      'npm run smoke:install'
}

Write-Host ""
Write-Host "✅ VERIFY OK — mode=$Mode 全绿" -ForegroundColor Green
Write-Host ""
Write-Host "下一步：把上面 $total 步的输出贴回 progress.md，并按 docs/quality.md §1 更新 feature_list.json" -ForegroundColor White
