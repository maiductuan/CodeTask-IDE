# Code Task IDE - Windows Local Build Script
$ErrorActionPreference = "Stop"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Code Task IDE — Local Windows Builder            " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is required but not installed." -ForegroundColor Red
    exit 1
}

# 2. Check Git
try {
    $gitVersion = git --version
    Write-Host "[OK] Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is required." -ForegroundColor Red
    exit 1
}

# 3. Check Python
try {
    $pythonVersion = python --version
    Write-Host "[OK] Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Python is recommended for native Electron modules compilation." -ForegroundColor Yellow
}

Write-Host "`n>>> Step 1: Setting up Engine and Embedding Agent..." -ForegroundColor Yellow
node scripts/setup.mjs

Write-Host "`n>>> Step 2: Compiling & Packaging Standalone Desktop App..." -ForegroundColor Yellow
node scripts/build.mjs

Write-Host "`n[DONE] Code Task IDE built successfully!" -ForegroundColor Green
