# GoldenLoft Auto-Fix & Push Script - FIXED
$ErrorActionPreference = "Continue"
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

Write-Host "--- Starting Auto-Maintenance ---" -ForegroundColor Cyan

function Has-Command($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Safe-Run($title, [scriptblock]$block) {
    Write-Host $title -ForegroundColor Yellow
    try { & $block } catch { Write-Host "⚠️  $($_.Exception.Message)" -ForegroundColor Magenta }
}

# 0) Optional lockfile cleanup
$pnpmLock = Join-Path $scriptPath "frontend\pnpm-lock.yaml"
if (Test-Path $pnpmLock) {
    Write-Host "Cleaning pnpm lockfile..." -ForegroundColor Gray
    Remove-Item -Force $pnpmLock
}

# 1) Frontend / Backend only if node/npm exist
if (Has-Command node -and Has-Command npm) {
    Safe-Run "Step 1/3: Cleaning Frontend..." {
        Set-Location (Join-Path $scriptPath "frontend")
        npm run format
        npm run lint:fix
    }

    Safe-Run "Step 2/3: Cleaning Backend..." {
        Set-Location (Join-Path $scriptPath "backend")
        npm run format
    }
}
else {
    Write-Host "Skipping npm steps (Node/npm not available or broken PATH)." -ForegroundColor Magenta
}

# 3) Git
Write-Host "Step 3/3: Git push..." -ForegroundColor Green
Set-Location $scriptPath

if (!(Test-Path ".git")) {
    Write-Host "Git not found! Initializing..." -ForegroundColor Yellow
    git init | Out-Null
}

# Ensure origin remote
$remotes = (git remote) 2>$null
if ($remotes -notmatch "(?m)^origin$") {
    Write-Host "Linking to GitHub repository..." -ForegroundColor Yellow
    git remote add origin "https://github.com/ahmed012013/GoldenLoft.git"
}

# Ensure we're on a branch (fix detached HEAD) and name it main
git checkout -B main | Out-Null

# Stage changes
git add -A

# If no staged changes, exit cleanly
$staged = (git diff --cached --name-only)
if ([string]::IsNullOrWhiteSpace($staged)) {
    Write-Host "No changes to commit. Exiting." -ForegroundColor Gray
    exit 0
}

# Commit
$msg = "chore: auto update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $msg | Out-Null

# Fetch only if remote main exists (avoid noisy errors)
git fetch origin 2>$null | Out-Null

# Try rebase if origin/main exists
git show-ref --verify --quiet refs/remotes/origin/main
if ($LASTEXITCODE -eq 0) {
    $pullOk = $true
    git pull --rebase origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Rebase failed. Resolve conflicts then run: git rebase --continue" -ForegroundColor Red
        exit 1
    }
}

# Push safely
Write-Host "Shipping to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed! If it's auth-related, switch to SSH or login with Git Credential Manager." -ForegroundColor Red
    exit 1
}

Write-Host "--- GoldenLoft is now Online! ---" -ForegroundColor Green
Set-Location $scriptPath
