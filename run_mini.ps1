<#
.SYNOPSIS
    Run mini-swe-agent in isolated task directory (Windows PowerShell version)
.DESCRIPTION
    Usage: .\run_mini.ps1 <task_folder> [model]
    Example: .\run_mini.ps1 task_1.1_button rnj-1-instruct-mlx
    Results are saved to: results/<model>/<task_folder>/
#>
param(
    [Parameter(Position=0)]
    [string]$TaskFolder,
    
    [Parameter(Position=1)]
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
$SourceTaskDir = Join-Path $SandboxDir $TaskFolder

# Results directory: results/<model>/<task>/
$ResultsBase = Join-Path $BaseDir "results"
$ResultsDir = Join-Path $ResultsBase $Model $TaskFolder

if (-not $TaskFolder) {
    Write-Host "Usage: .\run_mini.ps1 <task_folder> [model]"
    Write-Host ""
    Write-Host "Available tasks:"
    Get-ChildItem -Path $SandboxDir -Directory | ForEach-Object { Write-Host "  $($_.Name)" }
    Write-Host ""
    Write-Host "Available models (from LM Studio):"
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:1234/v1/models" -ErrorAction SilentlyContinue
        $response.data | ForEach-Object { Write-Host "  $($_.id)" }
    } catch {
        Write-Host "  (LM Studio not running)"
    }
    exit 1
}

if (-not (Test-Path $SourceTaskDir)) {
    Write-Host "Error: Task folder '$TaskFolder' not found in sandbox/"
    exit 1
}

$TaskMdPath = Join-Path $SourceTaskDir "TASK.md"
if (-not (Test-Path $TaskMdPath)) {
    Write-Host "Error: TASK.md not found in $SourceTaskDir"
    exit 1
}

# Create clean working directory in results
New-Item -ItemType Directory -Force -Path $ResultsDir | Out-Null

# Copy ALL files from sandbox to working directory (for multi-file tasks)
Copy-Item -Path "$SourceTaskDir\*" -Destination $ResultsDir -Recurse -Force

Write-Host "========================================"
Write-Host "mini-swe-agent Benchmark"
Write-Host "========================================"
Write-Host "Task: $TaskFolder"
Write-Host "Model: $Model"
Write-Host "Source: $SourceTaskDir"
Write-Host "Working Dir: $ResultsDir"
Write-Host "========================================"
Write-Host ""

# Create task-specific config with the selected model
$TaskConfig = Join-Path $ResultsDir ".mini_config.yaml"

# Note: Using Windows paths in config
$ConfigContent = @"
agent:
  system_template: |
    You are a helpful assistant that can interact with a computer.
    Your response must contain exactly ONE bash code block with ONE command (or commands connected with && or ||).
    
    CRITICAL: The code block MUST start with ``````bash - NOT just ``````
    
    WRONG (will be rejected):
    ``````
    cat TASK.md
    ``````
    
    CORRECT:
    ``````bash
    cat TASK.md
    ``````
    
    Failure to include "bash" after the triple backticks will cause your response to be REJECTED.
    Failure to follow these rules will cause your response to be rejected.
  instance_template: |
    Please solve this task:
    {{task}}

    You are in the directory: $ResultsDir
    The task requirements are in TASK.md file.

    ## CRITICAL SECURITY CONSTRAINT
    You are STRICTLY FORBIDDEN from accessing ANY files or directories outside of $ResultsDir
    DO NOT use ``cd ..``, ``cd /``, or any absolute paths outside your working directory
    DO NOT read, list, or access parent directories or sibling folders
    You have NO KNOWLEDGE of other tasks, solutions, or examples
    Any attempt to access external paths will be considered a FAILURE

    ## CRITICAL: This is a REAL environment
    You are running in a REAL shell environment. All commands you write WILL BE EXECUTED.
    You CAN and MUST read files using ``cat``. The output will be shown to you.

    ## MANDATORY First Step
    Your FIRST command MUST be to read the task file:
    ``````bash
    cat TASK.md
    ``````
    After reading TASK.md, you will see its contents and can proceed with implementation.

    ## Workflow
    1. FIRST: Read TASK.md with ``cat TASK.md`` (MANDATORY)
    2. Create the required files based on what you read
    3. Verify your implementation
    4. Submit: ``echo COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT``

    ## Important Rules
    1. Every response must contain exactly one action
    2. The action must be enclosed in triple backticks
    3. You are already in the correct directory. Just run commands directly.
    4. You are on Windows with Git Bash, use standard bash commands
    5. NEVER leave your working directory!

    ## Create a new file:
    ``````bash
    cat <<'EOF' > filename.ext
    file content here
    EOF
    ``````
  action_observation_template: |
    <returncode>{{output.returncode}}</returncode>
    {% if output.output | length < 10000 -%}
    <output>
    {{ output.output -}}
    </output>
    {%- else -%}
    <warning>Output too long, truncated.</warning>
    <output_head>{{ output.output[:5000] }}</output_head>
    <output_tail>{{ output.output[-5000:] }}</output_tail>
    {%- endif -%}
  format_error_template: |
    FORMAT ERROR! Your code block was not recognized.
    You MUST use ``````bash (not just ```````) at the start of your code block.
    Example: ``````bash
    cat TASK.md
    ``````
    If you want to end the task: ``echo COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT``
  timeout_template: |
    <timeout>Command timed out.</timeout>
  step_limit: 30
  cost_limit: 0
  mode: yolo

environment:
  env:
    PAGER: cat
    MANPAGER: cat
    LESS: -R
  cwd: "$ResultsDir"

model:
  model_name: "$Model"
  model_kwargs:
    custom_llm_provider: "openai"
    api_base: "http://localhost:1234/v1"
    api_key: "lmstudio"
    drop_params: true
  cost_tracking: "ignore_errors"
"@

$ConfigContent | Out-File -FilePath $TaskConfig -Encoding utf8

Write-Host "Running mini-swe-agent..."
Write-Host "---"

# Run mini-swe-agent from the clean results directory
Push-Location $ResultsDir

try {
    # Set environment variables for cache directories (use temp to keep results clean)
    $TempCache = Join-Path $env:TEMP "mini-swe-agent-cache"
    $env:XDG_CACHE_HOME = Join-Path $TempCache ".cache"
    $env:UV_CACHE_DIR = Join-Path $TempCache ".uv-cache"
    $env:MSWEA_COST_TRACKING = "ignore_errors"
    
    $LogPath = Join-Path $ResultsDir "run_log.txt"
    $TrajectoryPath = Join-Path $ResultsDir "trajectory.json"
    
    # Run mini-swe-agent and capture output
    & mini `
        -c $TaskConfig `
        -m $Model `
        -y `
        -t "Read TASK.md and complete the task. Create the required files in the current directory." `
        -o $TrajectoryPath `
        --exit-immediately `
        2>&1 | Tee-Object -FilePath $LogPath
    
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "========================================"
Write-Host "Task completed!"
Write-Host "========================================"
Write-Host "Results saved to: $ResultsDir"
Write-Host ""
Write-Host "Files created:"
Get-ChildItem -Path $ResultsDir -File | 
    Where-Object { $_.Name -notmatch "(TASK\.md|\.mini_config|run_log|trajectory)" } |
    ForEach-Object { Write-Host "  $($_.Name)" }
if (-not (Get-ChildItem -Path $ResultsDir -File | Where-Object { $_.Name -notmatch "(TASK\.md|\.mini_config|run_log|trajectory)" })) {
    Write-Host "  (no new files)"
}
Write-Host ""
Write-Host "Log: $ResultsDir\run_log.txt"
Write-Host "Trajectory: $ResultsDir\trajectory.json"
Write-Host "========================================"
