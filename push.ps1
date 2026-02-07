param(
    [string]$Branch = "main",
    [string]$CommitMessage = "",
    [string]$RepoUrl = "https://github.com/ahmed012013/GoldenLoft.git",
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$SkipGit,
    [switch]$ForcePush,
    [switch]$VerboseLogs
)

$scriptPath = $PSScriptRoot
Set-Location $scriptPath

# Import Modules
. "$scriptPath\logging.ps1"
. "$scriptPath\utils.ps1"

Write-Log "--- Starting GoldenLoft Auto-Maintenance ---" "Cyan"

# 0. Pre-checks
Safe-Run "Conflict Scan" { Scan-Conflicts } -Critical $true

# 1. Environment Checks
if (-not $SkipFrontend -or -not $SkipBackend) {
    Safe-Run "Check Node and NPM" {
        $NodeVer = node -v
        $NpmVer = npm -v
        Write-Log "Node: $NodeVer, NPM: $NpmVer" "Gray"
        if (-not $NodeVer) { throw "Node.js missing." }
    } -Critical $true
}

# 2. Frontend
if (-not $SkipFrontend) {
    if (Test-Path "$scriptPath\frontend") {
        Safe-Run "Frontend Format" {
            Push-Location "$scriptPath\frontend"
            try {
                # Use cmd /c to avoid Win32 errors with npm scripts
                cmd /c "npm run format"
                if ($LASTEXITCODE -ne 0) { throw "Format failed" }
            } finally { Pop-Location }
        }
        Safe-Run "Frontend Lint Fix" {
             Push-Location "$scriptPath\frontend"
             try {
                cmd /c "npm run lint:fix"
                if ($LASTEXITCODE -ne 0) { Write-Log "Lint warnings present." "Yellow" }
             } catch {
                Write-Log "Linting check failed but proceeding." "Yellow"
             } finally { Pop-Location }
        }
    }
}

# 3. Backend
if (-not $SkipBackend) {
    if (Test-Path "$scriptPath\backend") {
        Safe-Run "Backend Format" {
            Push-Location "$scriptPath\backend"
            try {
                cmd /c "npm run format"
                if ($LASTEXITCODE -ne 0) { throw "Format failed" }
            } finally { Pop-Location }
        }
    }
}

# 4. Git
if (-not $SkipGit) {
    Safe-Run "Git Setup" {
        if (-not (Test-Path .git)) {
            Write-Log "Initializing Git..." "Yellow"
            git init
        }
        $R = git remote
        if ($R -notcontains "origin") {
            Write-Log "Adding origin..." "Yellow"
            git remote add origin $RepoUrl
        }
    } -Critical $true

    Safe-Run "Git Checkout" {
        git checkout -B $Branch
    } -Critical $true

    Safe-Run "Git Commit" {
        git add -A
        $S = git status --porcelain
        if (-not $S) {
            Write-Log "No changes." "Green"
            Show-Summary
            exit 0
        }
        
        $D = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $Def = "chore: auto-fix $D"
        $M = if ($CommitMessage) { $CommitMessage } else { $Def }
        git commit -m "$M"
    }
    
    Safe-Run "Git Pull" {
        Write-VerboseLog "Fetching..."
        git fetch origin
        $Ref = git ls-remote --heads origin $Branch
        if ($Ref) {
            Write-Log "Pulling (rebase)..." "Cyan"
            git pull --rebase origin $Branch
            if ($LASTEXITCODE -ne 0) {
                 throw "Rebase conflict. Please resolve manually."
            }
        }
    } -Critical $true

    Safe-Run "Git Push" {
        $Args = @("push", "-u", "origin", $Branch)
        if ($ForcePush) {
            $Args += "--force-with-lease"
        }
        
        Write-Log "Pushing..." "Cyan"
        $Proc = Start-Process -FilePath "git" -ArgumentList $Args -NoNewWindow -Wait -PassThru
        if ($Proc.ExitCode -ne 0) {
            $C = $Proc.ExitCode
            throw "Push failed with code $C."
        }
    }
}

Show-Summary
exit 0
