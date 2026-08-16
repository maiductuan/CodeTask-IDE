# Code Task IDE - Launch Development Mode
$ErrorActionPreference = "Stop"

$ideRoot = Split-Path -Parent $PSScriptRoot
$vscodeSrc = Join-Path $ideRoot "vscode-src"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Code Task IDE -- Launching Development Mode       " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

if (-not (Test-Path $vscodeSrc)) {
    Write-Host "Engine source not found. Running setup..." -ForegroundColor Yellow
    node "$ideRoot\scripts\setup.mjs"
}

Set-Location $vscodeSrc

Write-Host "`n>>> [1/2] Checking dependencies with Yarn..." -ForegroundColor Yellow
yarn --frozen-lockfile --network-timeout 180000

Write-Host "`n>>> [2/2] Launching Code Task IDE Window..." -ForegroundColor Green
& cmd.exe /c ".\scripts\code.bat"
