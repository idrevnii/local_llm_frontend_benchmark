#!/bin/bash
# Run mini-swe-agent on ALL tasks
# Usage: ./run_all.sh [model]
# Example: ./run_all.sh qwen3-4b-thinking-2507
#
# Results are saved to: results/<model>/<task_folder>/

MODEL="${1:-rnj-1-instruct-mlx}"
BASE_DIR="$(pwd)"
SANDBOX_DIR="$BASE_DIR/sandbox"
SCRIPT_PATH="$BASE_DIR/run_mini.sh"

# Get all task folders
TASKS=($(ls -1 "$SANDBOX_DIR" | sort))

if [ ${#TASKS[@]} -eq 0 ]; then
    echo "Error: No task folders found in sandbox/"
    exit 1
fi

echo "========================================"
echo "🤖 mini-swe-agent Benchmark - Run All Tasks"
echo "========================================"
echo "Model: $MODEL"
echo "Tasks found: ${#TASKS[@]}"
echo "========================================"
echo ""

START_TIME=$(date +%s)
declare -a RESULTS_STATUS
declare -a RESULTS_DURATION

for TASK in "${TASKS[@]}"; do
    TASK_START=$(date +%s)
    
    echo ""
    echo "----------------------------------------"
    echo "🚀 Starting: $TASK"
    echo "----------------------------------------"
    
    # Run the task (continue even if it fails)
    if "$SCRIPT_PATH" "$TASK" "$MODEL"; then
        STATUS="SUCCESS"
    else
        STATUS="FAILED"
        echo "❌ ERROR: Task $TASK failed"
    fi
    
    # Clean up cache directories from results
    RESULTS_DIR="$BASE_DIR/results/$MODEL/$TASK"
    
    for CACHE_DIR in ".cache" ".uv-cache"; do
        CACHE_PATH="$RESULTS_DIR/$CACHE_DIR"
        if [ -d "$CACHE_PATH" ]; then
            echo "🧹 Cleaning up: $CACHE_DIR"
            rm -rf "$CACHE_PATH"
        fi
    done
    
    TASK_END=$(date +%s)
    TASK_DURATION=$((TASK_END - TASK_START))
    TASK_DURATION_FMT=$(printf "%02d:%02d" $((TASK_DURATION / 60)) $((TASK_DURATION % 60)))
    
    RESULTS_STATUS+=("$TASK:$STATUS")
    RESULTS_DURATION+=("$TASK:$TASK_DURATION_FMT")
    
    echo "✅ Completed: $TASK ($STATUS) - $TASK_DURATION_FMT"
done

END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))
TOTAL_FMT=$(printf "%02d:%02d:%02d" $((TOTAL_DURATION / 3600)) $(((TOTAL_DURATION % 3600) / 60)) $((TOTAL_DURATION % 60)))

echo ""
echo "========================================"
echo "🎉 All Tasks Completed!"
echo "========================================"
echo ""
echo "Summary:"
echo "--------"

SUCCESS_COUNT=0
FAILED_COUNT=0

for i in "${!RESULTS_STATUS[@]}"; do
    IFS=':' read -r TASK STATUS <<< "${RESULTS_STATUS[$i]}"
    IFS=':' read -r _ DURATION <<< "${RESULTS_DURATION[$i]}"
    
    if [ "$STATUS" = "SUCCESS" ]; then
        echo "  ✅ $TASK ($DURATION)"
        ((SUCCESS_COUNT++))
    else
        echo "  ❌ $TASK ($DURATION)"
        ((FAILED_COUNT++))
    fi
done

echo ""
echo "Total: ${#TASKS[@]} tasks"
echo "Success: $SUCCESS_COUNT"
echo "Failed: $FAILED_COUNT"
echo "Total time: $TOTAL_FMT"
echo ""
echo "Results saved to: results/$MODEL/"
echo "========================================"
