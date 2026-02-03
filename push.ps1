# GoldenLoft Auto-Fix & Push Script
$scriptPath = $PSScriptRoot
Set-Location $scriptPath
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "--- 🛠️ Starting Auto-Maintenance ---" -ForegroundColor Cyan

# 1. Frontend Auto-Fix
Write-Host "✨ 1/3 Cleaning & Fixing Frontend..." -ForegroundColor Yellow
cd "$scriptPath\frontend"
npm run format
npm run lint:fix
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Still some manual fixes needed in Frontend!" -ForegroundColor Red
    cd "$scriptPath"
    exit
}

# 2. Backend Auto-Fix
Write-Host "✨ 2/3 Cleaning & Fixing Backend..." -ForegroundColor Yellow
cd "$scriptPath\backend"
npm run format
# npm run lint:fix (لو ضفت السكربت في الباك اند)
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Still some manual fixes needed in Backend!" -ForegroundColor Red
    cd "$scriptPath"
    exit
}

# 3. Final Build & Push
Write-Host "🚀 3/3 Final Build Check & Push..." -ForegroundColor Green
cd "$scriptPath"
git add .
$msg = Read-Host "Enter Commit Message (e.g., Code Cleaned & Image Upload Added)"
git commit -m "$msg"
git push origin main

Write-Host "--- 🎉 GoldenLoft is now Factory-New and Online! ---" -ForegroundColor Green