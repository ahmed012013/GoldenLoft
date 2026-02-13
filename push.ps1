# GoldenLoft Auto-Fix & Push Script
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

Write-Host "--- Starting Auto-Maintenance (Zizo Edition) ---" -ForegroundColor Cyan

# 0. Cleanup Lockfiles
if (Test-Path "$scriptPath\frontend\pnpm-lock.yaml") {
    Write-Host "Cleaning pnpm lockfile..." -ForegroundColor Gray
    Remove-Item -Force "$scriptPath\frontend\pnpm-lock.yaml"
}

# 1. Frontend Auto-Fix
Write-Host "Step 1/3: Cleaning Frontend..." -ForegroundColor Yellow
cd "$scriptPath\frontend"
npm run format
Write-Host "Running Lint..." -ForegroundColor Gray
npm run lint:fix
if ($LASTEXITCODE -ne 0) {
    Write-Host "Lint issues found, but bypassing to keep the engine running!" -ForegroundColor Magenta
}

# 2. Backend Auto-Fix
Write-Host "Step 2/3: Cleaning Backend..." -ForegroundColor Yellow
cd "$scriptPath\backend"
npm run format
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend formatting issue, skipping..." -ForegroundColor Magenta
}

# 3. Git Check & Push
Write-Host "Step 3/3: Pushing to GitHub..." -ForegroundColor Green
cd "$scriptPath"

# Check for Git
if (!(Test-Path ".git")) {
    Write-Host "Git not found! Initializing..." -ForegroundColor Yellow
    git init
    git remote add origin "https://github.com/ahmed012013/GoldenLoft.git"
    git branch -M main
}

git add .
$msg = Read-Host "Enter Commit Message (Or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "swap update and clean" }

git commit -m "$msg"
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed! Check internet or permissions." -ForegroundColor Red
}
else {
    Write-Host "--- GoldenLoft is now Factory-New and Online! ---" -ForegroundColor Green
}