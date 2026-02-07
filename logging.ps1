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
