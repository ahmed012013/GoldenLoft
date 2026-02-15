# GoldenLoft Enhanced Deployment Script
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

Write-Host "--- GoldenLoft Deployment Assistant ---" -ForegroundColor Cyan

# Check for Git
if (!(Test-Path ".git")) {
    Write-Host "Error: Not a git repository." -ForegroundColor Red
    exit 1
}

# 1. Clean & Format Frontend
Write-Host "`nStep 1: Frontend Preparation..." -ForegroundColor Yellow
cd "$scriptPath\frontend"
if (Test-Path "package-lock.json") {
    Write-Host "Running format..." -ForegroundColor Gray
    npm run format | Out-Null
} else {
    Write-Host "Warning: Frontend package-lock.json not found." -ForegroundColor Magenta
}

# 2. Clean & Format Backend
Write-Host "`nStep 2: Backend Preparation..." -ForegroundColor Yellow
cd "$scriptPath\backend"
if (Test-Path "package-lock.json") {
    Write-Host "Running format..." -ForegroundColor Gray
    npm run format | Out-Null
} else {
    Write-Host "Warning: Backend package-lock.json not found." -ForegroundColor Magenta
}

# 3. Git Operations
Write-Host "`nStep 3: Git Push..." -ForegroundColor Green
cd "$scriptPath"

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
    exit 0
}

git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMsg = "fix: resolve production validation errors (api-client) - $timestamp"

Write-Host "Committing with message: $commitMsg" -ForegroundColor Gray
git commit -m "$commitMsg"

Write-Host "Pushing to origin/main..." -ForegroundColor Gray
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n--- Deployment Pushed Successfully! ---" -ForegroundColor Green
    Write-Host "Don't forget to set NEXT_PUBLIC_API_URL in your production environment!" -ForegroundColor Cyan
} else {
    Write-Host "`n--- Push Failed ---" -ForegroundColor Red
}
