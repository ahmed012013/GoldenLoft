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
        Write-Log "??? Success: $Name" "Green"
        return $true
    }
    catch {
        $ErrorMsg = $_.Exception.Message
        $Global:StepResults[$Name] = "Failed: $ErrorMsg"
        Write-Log "??? Failed: $Name - $ErrorMsg" "Red"
        
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
