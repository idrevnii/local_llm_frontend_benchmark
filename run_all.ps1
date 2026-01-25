# Run mini-swe-agent on ALL tasks (Windows PowerShell version)
# Usage: .\run_all.ps1 [model]
# Example: .\run_all.ps1 qwen3-4b-thinking-2507
#
# Results are saved to: results/<model>/<task_folder>/

param(
    [Parameter(Position=0)]
    [string]$Model = "rnj-1-instruct-mlx"
)

# Fix Unicode encoding for Windows console
$env:PYTHONIOENCODING = "utf-8"
$env:PYTHONUTF8 = "1"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Stop"

$BaseDir = Get-Location
$SandboxDir = Join-Path $BaseDir "sandbox"
$ScriptPath = Join-Path $BaseDir "run_mini.ps1"

# Get all task folders
$Tasks = Get-ChildItem -Path $SandboxDir -Directory | Sort-Object Name

if ($Tasks.Count -eq 0) {
    Write-Host "Error: No task folders found in sandbox/"
    exit 1
}

Write-Host "========================================"
Write-Host "mini-swe-agent Benchmark - Run All Tasks"
Write-Host "========================================"
Write-Host "Model: $Model"
Write-Host "Tasks found: $($Tasks.Count)"
Write-Host "========================================"
Write-Host ""

$StartTime = Get-Date
$Results = @()

foreach ($Task in $Tasks) {
    $TaskName = $Task.Name
    $TaskStartTime = Get-Date
    
    Write-Host ""
    Write-Host "----------------------------------------"
    Write-Host "Starting: $TaskName"
    Write-Host "----------------------------------------"
    
    try {
        # Run the task
        & $ScriptPath -TaskFolder $TaskName -Model $Model
        
        $TaskStatus = "SUCCESS"
    } catch {
        Write-Host "ERROR: Task $TaskName failed: $_"
        $TaskStatus = "FAILED"
    }
    
    # Clean up cache directories from results
    $ResultsDir = Join-Path $BaseDir "results" $Model $TaskName
    
    $CacheDirs = @(".cache", ".uv-cache")
    foreach ($CacheDir in $CacheDirs) {
        $CachePath = Join-Path $ResultsDir $CacheDir
        if (Test-Path $CachePath) {
            Write-Host "Cleaning up: $CacheDir"
            Remove-Item -Path $CachePath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    $TaskEndTime = Get-Date
    $TaskDuration = $TaskEndTime - $TaskStartTime
    
    $Results += [PSCustomObject]@{
        Task = $TaskName
        Status = $TaskStatus
        Duration = $TaskDuration.ToString("mm\:ss")
    }
    
    Write-Host "Completed: $TaskName ($TaskStatus) - $($TaskDuration.ToString('mm\:ss'))"
}

$EndTime = Get-Date
$TotalDuration = $EndTime - $StartTime

Write-Host ""
Write-Host "========================================"
Write-Host "All Tasks Completed!"
Write-Host "========================================"
Write-Host ""
Write-Host "Summary:"
Write-Host "--------"

$SuccessCount = ($Results | Where-Object { $_.Status -eq "SUCCESS" }).Count
$FailedCount = ($Results | Where-Object { $_.Status -eq "FAILED" }).Count

foreach ($Result in $Results) {
    $StatusIcon = if ($Result.Status -eq "SUCCESS") { "[OK]" } else { "[FAIL]" }
    Write-Host "  $StatusIcon $($Result.Task) ($($Result.Duration))"
}

Write-Host ""
Write-Host "Total: $($Tasks.Count) tasks"
Write-Host "Success: $SuccessCount"
Write-Host "Failed: $FailedCount"
Write-Host "Total time: $($TotalDuration.ToString('hh\:mm\:ss'))"
Write-Host ""
Write-Host "Results saved to: results\$Model\"
Write-Host "========================================"
