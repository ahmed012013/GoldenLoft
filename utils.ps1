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

function Scan-Conflicts {
    Write-Log "Scanning for merge conflicts..." "Cyan"
    $ConflictPattern = "<<<<<<< HEAD"
    $Files = Get-ChildItem -Recurse -File -Exclude "node_modules",".git","dist",".next" | Select-String -Pattern $ConflictPattern -List
    
    if ($Files) {
        Write-Log "??? Merge conflicts detected in the following files:" "Red"
        foreach ($F in $Files) {
            Write-Host "  - $($F.Path)" -ForegroundColor Red
        }
        throw "Merge conflicts found. Please resolve them before pushing."
    }
    Write-Log "No conflicts found." "Green"
}
