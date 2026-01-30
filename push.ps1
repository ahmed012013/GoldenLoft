# --- GoldenLoft Pro Auto-Push Script ---
$REPO_URL = "https://github.com/ahmed012013/GoldenLoft.git"

# 1. Start Engine (Git Init)
if (!(Test-Path .git)) {
    Write-Host "Wait... Initializing Git..." -ForegroundColor Yellow
    git init
    git remote add origin $REPO_URL
    git branch -M main
}
else {
    git remote set-url origin $REPO_URL
}

# 2. Cleaning (Format)
Write-Host "1/3 Cleaning Code..." -ForegroundColor Cyan
Set-Location frontend; npm run format; Set-Location ..
Set-Location backend; npm run format; Set-Location ..

# 3. Logbook (Commit)
Write-Host "2/3 Saving Changes..." -ForegroundColor Cyan
git add .
$msg = Read-Host "Enter Commit Message (or press Enter for 'Auto-Update')"
if ($msg -eq "") { $msg = "Auto-Update and Breeding Logic" }
git commit -m "$msg"

# 4. Final Push
Write-Host "3/3 Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Success! GoldenLoft is Live on GitHub." -ForegroundColor Yellow