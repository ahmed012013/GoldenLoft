$ErrorActionPreference = "Stop"

$loggingContent = @'
$ErrorActionPreference = "Continue"

function Write-Log {
    param([string]$Msg, [string]$Color = "White")
    $Time = Get-Date -Format "HH:mm:ss"
    Write-Host "[$Time] $Msg" -ForegroundColor $Color
}

function Write-VerboseLog {
    param([string]$Msg)
    if ($VerboseLogs) { Write-Host "[VERBOSE] $Msg" -ForegroundColor Gray }
}
'@

$utilsContent = @'
$Global:StepResults = @{}

function Show-Summary {
    Write-Host "`n=== EXECUTION SUMMARY ===" -ForegroundColor White
    $Global:StepResults.GetEnumerator() | ForEach-Object {
        $Key = $_.Key
        $Val = $_.Value
        if ($Val -like "Success*") { $C = "Green" }
        elseif ($Val -like "Failed*") { $C = "Red" }
        else { $C = "Yellow" }
        Write-Host "$($Key): $Val" -ForegroundColor $C
    }
    Write-Host "=========================`n" -ForegroundColor White
}

function Safe-Run {
    param(
        [string]$Name,
        [scriptblock]$Block,
        [bool]$Critical = $false
    )
    
    Write-Log "Starting: $Name" "Cyan"
    $Global:StepResults[$Name] = "Running..."
    
    try {
        & $Block
        $Global:StepResults[$Name] = "Success"
        Write-Log "✔ Success: $Name" "Green"
        return $true
    }
    catch {
        $ErrorMsg = $_.Exception.Message
        $Global:StepResults[$Name] = "Failed: $ErrorMsg"
        Write-Log "❌ Failed: $Name - $ErrorMsg" "Red"
        
        if ($Critical) {
            Write-Log "Critical failure in $Name. Exiting script." "Red"
            Show-Summary
            exit 1
        }
        return $false
    }
}

function Diagnose-Npm {
    Write-Log "Running NPM Diagnostics..." "Magenta"
    
    $Paths = @(
        "$PSScriptRoot\.npmrc",
        "$PSScriptRoot\frontend\.npmrc",
        "$PSScriptRoot\backend\.npmrc",
        "$env:USERPROFILE\.npmrc"
    )
    
    foreach ($P in $Paths) {
        if (Test-Path $P) {
            Write-VerboseLog "Found .npmrc at: $P"
            try {
                $Raw = Get-Content $P -Raw
                # Regex safe quoting using single quotes
                $Pattern = '(?i)(_authToken=)[^\r\n]+'
                $Safe = $Raw -replace $Pattern, '$1[HIDDEN]'
                Write-VerboseLog "Content:`n$Safe"
            } catch {
                Write-VerboseLog "Could not read $P"
            }
        }
    }

    Write-Log "Attempting fix: Clearing npm cache..." "Yellow"
    Start-Process npm -ArgumentList "cache","clean","--force" -NoNewWindow -Wait
    
    Write-Log "Recommendation: If issues persist, install Node.js LTS." "Magenta"
}

function Run-NpmCommand {
    param([string]$Cmd, [string]$Path)
    
    Push-Location $Path
    try {
        Write-VerboseLog "Executing '$Cmd' in $Path..."
        $Proc = Start-Process -FilePath "powershell" -ArgumentList "-Command", "$Cmd" -NoNewWindow -Wait -PassThru
        
        if ($Proc.ExitCode -ne 0) {
            Write-Log "Command '$Cmd' failed with exit code $($Proc.ExitCode)." "Yellow"
            Diagnose-Npm
            
            Write-Log "Retrying command with --workspaces=false..." "Yellow"
            $RetryCmd = "$Cmd --workspaces=false"
            $RetryProc = Start-Process -FilePath "powershell" -ArgumentList "-Command", "$RetryCmd" -NoNewWindow -Wait -PassThru
            
            if ($RetryProc.ExitCode -ne 0) {
                throw "Command failed even after diagnostics and retry."
            } else {
                Write-Log "Retry succeeded!" "Green"
            }
        }
    }
    finally {
        Pop-Location
    }
}
'@

$pushContent = @'
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

# 1. Checks
if (-not $SkipFrontend -or -not $SkipBackend) {
    Safe-Run "Check Node and NPM" {
        if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js missing." }
        if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "npm missing." }
        Write-Log "Node Check OK" "Gray"
    } -Critical $true
}

# 2. Frontend
if (-not $SkipFrontend) {
    if (Test-Path "$scriptPath\frontend") {
        Safe-Run "Frontend Format" {
            Run-NpmCommand "npm run format" "$scriptPath\frontend"
        }
        Safe-Run "Frontend Lint Fix" {
             try {
                Run-NpmCommand "npm run lint:fix" "$scriptPath\frontend"
             } catch {
                Write-Log "Linting check failed but proceeding." "Yellow"
             }
        }
    }
}

# 3. Backend
if (-not $SkipBackend) {
    if (Test-Path "$scriptPath\backend") {
        Safe-Run "Backend Format" {
            Run-NpmCommand "npm run format" "$scriptPath\backend"
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
'@

Set-Content -Path "logging.ps1" -Value $loggingContent -Encoding Ascii
Set-Content -Path "utils.ps1" -Value $utilsContent -Encoding Ascii
Set-Content -Path "push.ps1" -Value $pushContent -Encoding Ascii

Write-Host "Scripts generated successfully." -ForegroundColor Green
