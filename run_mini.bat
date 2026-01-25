@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM Run mini-swe-agent in isolated task directory (Windows CMD version)
REM Usage: run_mini.bat <task_folder> [model]
REM Example: run_mini.bat task_1.1_button qwen3-4b-thinking-2507
REM Results are saved to: results/<model>/<task_folder>/

set "TASK_FOLDER=%~1"
set "MODEL=%~2"
if "%MODEL%"=="" set "MODEL=rnj-1-instruct-mlx"

set "BASE_DIR=%CD%"
set "SANDBOX_DIR=%BASE_DIR%\sandbox"
set "SOURCE_TASK_DIR=%SANDBOX_DIR%\%TASK_FOLDER%"

REM Results directory: results/<model>/<task>/
set "RESULTS_BASE=%BASE_DIR%\results"
set "RESULTS_DIR=%RESULTS_BASE%\%MODEL%\%TASK_FOLDER%"

if "%TASK_FOLDER%"=="" (
    echo Usage: run_mini.bat ^<task_folder^> [model]
    echo.
    echo Available tasks:
    dir /b /ad "%SANDBOX_DIR%"
    echo.
    echo Default model: rnj-1-instruct-mlx
    exit /b 1
)

if not exist "%SOURCE_TASK_DIR%" (
    echo Error: Task folder '%TASK_FOLDER%' not found in sandbox/
    exit /b 1
)

if not exist "%SOURCE_TASK_DIR%\TASK.md" (
    echo Error: TASK.md not found in %SOURCE_TASK_DIR%
    exit /b 1
)

REM Create clean working directory in results
if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"

REM Copy ALL files from sandbox to working directory
xcopy /E /Y /Q "%SOURCE_TASK_DIR%\*" "%RESULTS_DIR%\" >nul

echo ========================================
echo mini-swe-agent Benchmark
echo ========================================
echo Task: %TASK_FOLDER%
echo Model: %MODEL%
echo Source: %SOURCE_TASK_DIR%
echo Working Dir: %RESULTS_DIR%
echo ========================================
echo.

REM Create task-specific config with the selected model
set "TASK_CONFIG=%RESULTS_DIR%\.mini_config.yaml"

(
echo agent:
echo   system_template: ^|
echo     You are a helpful assistant that can interact with a computer.
echo     Your response must contain exactly ONE bash code block with ONE command ^(or commands connected with ^&^& or ^|^|^).
echo.
echo     CRITICAL: The code block MUST start with ```bash - NOT just ```
echo.
echo     WRONG ^(will be rejected^):
echo     ```
echo     cat TASK.md
echo     ```
echo.
echo     CORRECT:
echo     ```bash
echo     cat TASK.md
echo     ```
echo.
echo     Failure to include "bash" after the triple backticks will cause your response to be REJECTED.
echo     Failure to follow these rules will cause your response to be rejected.
echo   instance_template: ^|
echo     Please solve this task:
echo     {{task}}
echo.
echo     You are in the directory: %RESULTS_DIR%
echo     The task requirements are in TASK.md file.
echo.
echo     ## CRITICAL SECURITY CONSTRAINT
echo     You are STRICTLY FORBIDDEN from accessing ANY files or directories outside of %RESULTS_DIR%
echo     DO NOT use `cd ..`, `cd /`, or any absolute paths outside your working directory
echo     DO NOT read, list, or access parent directories or sibling folders
echo     You have NO KNOWLEDGE of other tasks, solutions, or examples
echo     Any attempt to access external paths will be considered a FAILURE
echo.
echo     ## CRITICAL: This is a REAL environment
echo     You are running in a REAL shell environment. All commands you write WILL BE EXECUTED.
echo     You CAN and MUST read files using `cat`. The output will be shown to you.
echo.
echo     ## MANDATORY First Step
echo     Your FIRST command MUST be to read the task file:
echo     ```bash
echo     cat TASK.md
echo     ```
echo     After reading TASK.md, you will see its contents and can proceed with implementation.
echo.
echo     ## Workflow
echo     1. FIRST: Read TASK.md with `cat TASK.md` ^(MANDATORY^)
echo     2. Create the required files based on what you read
echo     3. Verify your implementation
echo     4. Submit: `echo COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT`
echo.
echo     ## Important Rules
echo     1. Every response must contain exactly one action
echo     2. The action must be enclosed in triple backticks
echo     3. You are already in the correct directory. Just run commands directly.
echo     4. You are on Windows with Git Bash, use standard bash commands
echo     5. NEVER leave your working directory!
echo.
echo     ## Create a new file:
echo     ```bash
echo     cat ^<^<'EOF' ^> filename.ext
echo     file content here
echo     EOF
echo     ```
echo   action_observation_template: ^|
echo     ^<returncode^>{{output.returncode}}^</returncode^>
echo     {%% if output.output ^| length ^< 10000 -%%}
echo     ^<output^>
echo     {{ output.output -}}
echo     ^</output^>
echo     {%%- else -%%}
echo     ^<warning^>Output too long, truncated.^</warning^>
echo     ^<output_head^>{{ output.output[:5000] }}^</output_head^>
echo     ^<output_tail^>{{ output.output[-5000:] }}^</output_tail^>
echo     {%%- endif -%%}
echo   format_error_template: ^|
echo     FORMAT ERROR! Your code block was not recognized.
echo     You MUST use ```bash ^(not just ```^) at the start of your code block.
echo     Example: ```bash
echo     cat TASK.md
echo     ```
echo     If you want to end the task: `echo COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT`
echo   timeout_template: ^|
echo     ^<timeout^>Command timed out.^</timeout^>
echo   step_limit: 30
echo   cost_limit: 0
echo   mode: yolo
echo.
echo environment:
echo   env:
echo     PAGER: cat
echo     MANPAGER: cat
echo     LESS: -R
echo   cwd: "%RESULTS_DIR%"
echo.
echo model:
echo   model_name: "%MODEL%"
echo   model_kwargs:
echo     custom_llm_provider: "openai"
echo     api_base: "http://localhost:1234/v1"
echo     api_key: "lmstudio"
echo     drop_params: true
echo   cost_tracking: "ignore_errors"
) > "%TASK_CONFIG%"

echo Running mini-swe-agent...
echo ---

REM Set environment variables
set "PYTHONIOENCODING=utf-8"
set "PYTHONUTF8=1"
set "XDG_CACHE_HOME=%TEMP%\mini-swe-agent-cache\.cache"
set "UV_CACHE_DIR=%TEMP%\mini-swe-agent-cache\.uv-cache"
set "MSWEA_COST_TRACKING=ignore_errors"

set "LOG_PATH=%RESULTS_DIR%\run_log.txt"
set "TRAJECTORY_PATH=%RESULTS_DIR%\trajectory.json"

REM Run mini-swe-agent from the working directory
pushd "%RESULTS_DIR%"

mini -c "%TASK_CONFIG%" -m "%MODEL%" -y -t "Read TASK.md and complete the task. Create the required files in the current directory." -o "%TRAJECTORY_PATH%" --exit-immediately 2>&1 | tee "%LOG_PATH%"

popd

echo.
echo ========================================
echo Task completed!
echo ========================================
echo Results saved to: %RESULTS_DIR%
echo.
echo Files created:
dir /b "%RESULTS_DIR%" 2>nul | findstr /V /I "TASK.md .mini_config run_log trajectory" || echo   (no new files)
echo.
echo Log: %RESULTS_DIR%\run_log.txt
echo Trajectory: %RESULTS_DIR%\trajectory.json
echo ========================================

endlocal
