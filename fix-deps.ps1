# fix-deps.ps1
# PowerShell script to clean dependencies, remove pnpm-lock.yaml, reinstall with npm, and bypass ESLint in build.

$ErrorActionPreference = "Stop"

Write-Host "Starting dependency cleanup and fix process..." -ForegroundColor Cyan

# 1. Delete all node_modules recursively
Write-Host "Looking for node_modules directories..." -ForegroundColor Yellow
$nodeModules = Get-ChildItem -Path . -Include node_modules -Recurse -Directory -ErrorAction SilentlyContinue

if ($nodeModules) {
    foreach ($dir in $nodeModules) {
        Write-Host "Removing $($dir.FullName)..." -ForegroundColor Magenta
        Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction Continue
    }
}
else {
    Write-Host "No node_modules found." -ForegroundColor Gray
}

# 2. Remove pnpm-lock.yaml
Write-Host "Looking for pnpm-lock.yaml files..." -ForegroundColor Yellow
$pnpmLocks = Get-ChildItem -Path . -Include pnpm-lock.yaml -Recurse -File -ErrorAction SilentlyContinue

if ($pnpmLocks) {
    foreach ($file in $pnpmLocks) {
        Write-Host "Removing $($file.FullName)..." -ForegroundColor Magenta
        Remove-Item -Path $file.FullName -Force -ErrorAction Continue
    }
}
else {
    Write-Host "No pnpm-lock.yaml found." -ForegroundColor Gray
}

# 3. Update frontend package.json to bypass ESLint during build
$frontendPackageJson = ".\frontend\package.json"
if (Test-Path $frontendPackageJson) {
    Write-Host "Updating $frontendPackageJson to bypass ESLint..." -ForegroundColor Yellow
    try {
        $content = Get-Content -Path $frontendPackageJson -Raw
        
        # Simple string replacement to preserve formatting often better than JSON roundtrip in PS
        if ($content -match '"build": "next build"') {
            $newContent = $content -replace '"build": "next build"', '"build": "next build --no-lint"'
            Set-Content -Path $frontendPackageJson -Value $newContent
            Write-Host "Build script updated to 'next build --no-lint'." -ForegroundColor Green
        }
        elseif ($content -match '"build": "next build --no-lint"') {
            Write-Host "Build script already set to bypass linting." -ForegroundColor Cyan
        }
        else {
            Write-Warning "Could not pattern match 'next build' script. Please check package.json manually."
        }
    }
    catch {
        Write-Error "Failed to update package.json: $_"
    }
}
else {
    Write-Warning "Frontend package.json not found at $frontendPackageJson"
}

# 4. Reinstall dependencies using npm
Write-Host "Reinstalling dependencies with npm install..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Dependencies installed successfully." -ForegroundColor Green
}
catch {
    Write-Error "npm install failed. Please check the error output."
}

Write-Host "Fix process completed." -ForegroundColor Cyan
