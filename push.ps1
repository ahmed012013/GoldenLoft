# GoldenLoft Auto-Fix & Push Script - Safer Edition
$ErrorActionPreference = "Stop"
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

Write-Host "--- Starting Auto-Maintenance ---" -ForegroundColor Cyan

function Run-Step($name, [scriptblock]$cmd, $allowFail = $false) {
    Write-Host $name -ForegroundColor Yellow
    try {
        & $cmd
    }
    catch {
        if ($allowFail) {
            Write-Host "⚠️  $name failed but continuing: $($_.Exception.Message)" -ForegroundColor Magenta
        }
        else {
            throw
        }
    }
}

# 0) Optional: Cleanup lockfile (ONLY if you really want npm-only)
$pnpmLock = Join-Path $scriptPath "frontend\pnpm-lock.yaml"
if (Test-Path $pnpmLock) {
    Write-Host "Removing pnpm lockfile (npm-only mode)..." -ForegroundColor Gray
    Remove-Item -Force $pnpmLock
}

# 1) Frontend
Run-Step "Step 1/3: Frontend format" { Set-Location (Join-Path $scriptPath "frontend"); npm run format } $true
Run-Step "Frontend lint:fix" { Set-Location (Join-Path $scriptPath "frontend"); npm run lint:fix } $true

# 2) Backend
Run-Step "Step 2/3: Backend format" { Set-Location (Join-Path $scriptPath "backend"); npm run format } $true

# 3) Git
Write-Host "Step 3/3: Git push..." -ForegroundColor Green
Set-Location $scriptPath

if (!(Test-Path (Join-Path $scriptPath ".git"))) {
    Write-Host "Git not found! Initializing..." -ForegroundColor Yellow
    git init | Out-Null
}

# Ensure origin remote
$origin = (git remote) -split "`n" | ForEach-Object { $_.Trim() }
if ($origin -notcontains "origin") {
    Write-Host "Linking origin..." -ForegroundColor Yellow
    git remote add origin "https://github.com/ahmed012013/GoldenLoft.git"
}

# Ensure branch main
git branch -M main | Out-Null

# Fetch remote (avoid non-fast-forward surprises)
git fetch origin main 2>$null

# Stage
git add -A

# If no changes, exit cleanly
$hasStaged = (git diff --cached --name-only)
if ([string]::IsNullOrWhiteSpace($hasStaged)) {
    Write-Host "No changes to commit. Exiting." -ForegroundColor Gray
    exit 0
}

# Auto commit message (no prompt)
$msg = "chore: auto-fix $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $msg | Out-Null

# Rebase if remote exists
$remoteMainExists = (git show-ref "refs/remotes/origin/main" 2>$null)
if ($LASTEXITCODE -eq 0) {
    try {
        git pull --rebase origin main | Out-Null
    }
    catch {
        Write-Host "❌ Rebase failed. Resolve conflicts then run: git rebase --continue" -ForegroundColor Red
        exit 1
    }
}

# Push safely
Write-Host "Shipping to GitHub (force-with-lease)..." -ForegroundColor Cyan
git push origin main --force-with-lease

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed! Check GitHub auth / permissions / branch protection." -ForegroundColor Red
    exit 1
}

Write-Host "--- GoldenLoft is now Online! ---" -ForegroundColor Green
Set-Location $scriptPath
