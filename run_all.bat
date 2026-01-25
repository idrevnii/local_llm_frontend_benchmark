@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM Run mini-swe-agent on ALL tasks (Windows CMD version)
REM Usage: run_all.bat [model]
REM Example: run_all.bat qwen3-4b-thinking-2507
REM Results are saved to: results/<model>/<task_folder>/

set "MODEL=%~1"
if "%MODEL%"=="" set "MODEL=rnj-1-instruct-mlx"

set "BASE_DIR=%CD%"
set "SANDBOX_DIR=%BASE_DIR%\sandbox"
set "SCRIPT_PATH=%BASE_DIR%\run_mini.bat"

REM Count tasks
set TASK_COUNT=0
for /d %%D in ("%SANDBOX_DIR%\*") do set /a TASK_COUNT+=1

if %TASK_COUNT%==0 (
    echo Error: No task folders found in sandbox/
    exit /b 1
)

echo ========================================
echo mini-swe-agent Benchmark - Run All Tasks
echo ========================================
echo Model: %MODEL%
echo Tasks found: %TASK_COUNT%
echo ========================================
echo.

set SUCCESS_COUNT=0
set FAILED_COUNT=0
set "START_TIME=%TIME%"

for /d %%D in ("%SANDBOX_DIR%\*") do (
    set "TASK_NAME=%%~nxD"
    
    echo.
    echo ----------------------------------------
    echo Starting: !TASK_NAME!
    echo ----------------------------------------
    
    call "%SCRIPT_PATH%" "!TASK_NAME!" "%MODEL%"
    
    if !errorlevel! equ 0 (
        set /a SUCCESS_COUNT+=1
        echo Completed: !TASK_NAME! [OK]
    ) else (
        set /a FAILED_COUNT+=1
        echo Completed: !TASK_NAME! [FAILED]
    )
    
    REM Clean up cache directories
    set "RESULTS_DIR=%BASE_DIR%\results\%MODEL%\!TASK_NAME!"
    if exist "!RESULTS_DIR!\.cache" rd /s /q "!RESULTS_DIR!\.cache" 2>nul
    if exist "!RESULTS_DIR!\.uv-cache" rd /s /q "!RESULTS_DIR!\.uv-cache" 2>nul
)

echo.
echo ========================================
echo All Tasks Completed!
echo ========================================
echo.
echo Total: %TASK_COUNT% tasks
echo Success: %SUCCESS_COUNT%
echo Failed: %FAILED_COUNT%
echo.
echo Results saved to: results\%MODEL%\
echo ========================================

endlocal
