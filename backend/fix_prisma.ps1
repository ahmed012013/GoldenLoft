Write-Host "--- A GENT FIX PRISMA SCRIPT ---"

# 1. Clean Env Vars (Current Process)
$env:PRISMA_CLIENT_ENGINE_TYPE=$null
$env:PRISMA_CLI_QUERY_ENGINE_TYPE=$null

# 2. Clean Env Vars (User Registry)
[Environment]::SetEnvironmentVariable("PRISMA_CLIENT_ENGINE_TYPE", $null, "User")
[Environment]::SetEnvironmentVariable("PRISMA_CLI_QUERY_ENGINE_TYPE", $null, "User")

Write-Host "✅ Environment variables cleaned."

# 3. Clean .prisma cache
if (Test-Path "node_modules/.prisma") { 
    Write-Host "Cleaning node_modules/.prisma..."
    Remove-Item -Recurse -Force "node_modules/.prisma" 
}

# 4. Generate
Write-Host "🔄 Generating Prisma Client..."
cmd /c "npx prisma generate"
if ($LASTEXITCODE -ne 0) { 
    Write-Error "❌ Prisma generate failed!"
    exit 1 
}

# 5. Start Server
Write-Host "🚀 Starting NestJS Server..."
cmd /c "npm run start:dev"
