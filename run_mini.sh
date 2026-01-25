#!/bin/bash
# Run mini-swe-agent in isolated task directory
# Usage: ./run_mini.sh <task_folder> [model]
# Example: ./run_mini.sh task_1.1_button rnj-1-instruct-mlx
#
# Results are saved to: results/<model>/<task_folder>/

set -e

TASK_FOLDER="$1"
MODEL="${2:-rnj-1-instruct-mlx}"
BASE_DIR="$(pwd)"
SANDBOX_DIR="$BASE_DIR/sandbox"
SOURCE_TASK_DIR="$SANDBOX_DIR/$TASK_FOLDER"

# Results directory: results/<model>/<task>/
RESULTS_BASE="$BASE_DIR/results"
RESULTS_DIR="$RESULTS_BASE/$MODEL/$TASK_FOLDER"

if [ -z "$TASK_FOLDER" ]; then
  echo "Usage: ./run_mini.sh <task_folder> [model]"
  echo ""
  echo "Available tasks:"
  ls -1 sandbox/
  echo ""
  echo "Available models (from LM Studio):"
  curl -s http://localhost:1234/v1/models 2>/dev/null | jq -r '.data[].id' || echo "  (LM Studio not running)"
  exit 1
fi

if [ ! -d "$SOURCE_TASK_DIR" ]; then
  echo "Error: Task folder '$TASK_FOLDER' not found in sandbox/"
  exit 1
fi

if [ ! -f "$SOURCE_TASK_DIR/TASK.md" ]; then
  echo "Error: TASK.md not found in $SOURCE_TASK_DIR"
  exit 1
fi

# Create clean working directory in results
mkdir -p "$RESULTS_DIR"

# Copy ALL files from sandbox to working directory (for multi-file tasks)
# This includes TASK.md, src/, config/, logs/, etc.
cp -r "$SOURCE_TASK_DIR/"* "$RESULTS_DIR/"

echo "========================================"
echo "🤖 mini-swe-agent Benchmark"
echo "========================================"
echo "Task: $TASK_FOLDER"
echo "Model: $MODEL"
echo "Source: $SOURCE_TASK_DIR"
echo "Working Dir: $RESULTS_DIR"
echo "========================================"
echo ""

# Create task-specific config with the selected model
TASK_CONFIG="$RESULTS_DIR/.mini_config.yaml"
cat > "$TASK_CONFIG" <<EOF
agent:
  system_template: |
    You are a helpful assistant that can interact with a computer.
    Your response must contain exactly ONE bash code block with ONE command (or commands connected with && or ||).
    
    ⚠️ CRITICAL: The code block MUST start with \`\`\`bash - NOT just \`\`\`
    
    ❌ WRONG (will be rejected):
    \`\`\`
    cat TASK.md
    \`\`\`
    
    ✅ CORRECT:
    \`\`\`bash
    cat TASK.md
    \`\`\`
    
    Failure to include "bash" after the triple backticks will cause your response to be REJECTED.
    Failure to follow these rules will cause your response to be rejected.
  instance_template: |
    Please solve this task:
    {{task}}

    You are in the directory: $RESULTS_DIR
    The task requirements are in TASK.md file.

    ## CRITICAL SECURITY CONSTRAINT
    ⛔ You are STRICTLY FORBIDDEN from accessing ANY files or directories outside of $RESULTS_DIR
    ⛔ DO NOT use \`cd ..\`, \`cd /\`, or any absolute paths outside your working directory
    ⛔ DO NOT read, list, or access parent directories or sibling folders
    ⛔ You have NO KNOWLEDGE of other tasks, solutions, or examples
    ⛔ Any attempt to access external paths will be considered a FAILURE

    ## CRITICAL: This is a REAL environment
    You are running in a REAL shell environment. All commands you write WILL BE EXECUTED.
    You CAN and MUST read files using \`cat\`. The output will be shown to you.

    ## MANDATORY First Step
    Your FIRST command MUST be to read the task file:
    \`\`\`bash
    cat TASK.md
    \`\`\`
    After reading TASK.md, you will see its contents and can proceed with implementation.

    ## Workflow
    1. FIRST: Read TASK.md with \`cat TASK.md\` (MANDATORY)
    2. Create the required files based on what you read
    3. Verify your implementation
    4. Submit: \`echo COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT\`

    ## Important Rules
    1. Every response must contain exactly one action
    2. The action must be enclosed in triple backticks
    3. You are already in the correct directory. Just run commands directly.
    4. You are on MacOS, use \`sed -i ''\` instead of \`sed -i\`
    5. NEVER leave your working directory!

    ## Create a new file:
    \`\`\`bash
    cat <<'EOF' > filename.ext
    file content here
    EOF
    \`\`\`
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
    ⚠️ FORMAT ERROR! Your code block was not recognized.
    You MUST use \`\`\`bash (not just \`\`\`) at the start of your code block.
    Example: \`\`\`bash
    cat TASK.md
    \`\`\`
    If you want to end the task: \`echo COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT\`
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
  cwd: "$RESULTS_DIR"

model:
  model_name: "$MODEL"
  model_kwargs:
    custom_llm_provider: "openai"
    api_base: "http://localhost:1234/v1"
    api_key: "lmstudio"
    drop_params: true
  cost_tracking: "ignore_errors"
EOF

echo "Running mini-swe-agent..."
echo "---"

# Run mini-swe-agent from the clean results directory
cd "$RESULTS_DIR"
# Ensure uv/uvx cache stays inside the sandboxed workspace (Codex CLI disallows writing to ~/.cache)
export XDG_CACHE_HOME="$RESULTS_DIR/.cache"
export UV_CACHE_DIR="$RESULTS_DIR/.uv-cache"
MSWEA_COST_TRACKING=ignore_errors mini \
  -c "$TASK_CONFIG" \
  -m "$MODEL" \
  -y \
  -t "Read TASK.md and complete the task. Create the required files in the current directory." \
  -o "$RESULTS_DIR/trajectory.json" \
  --exit-immediately \
  2>&1 | tee "$RESULTS_DIR/run_log.txt"

echo ""
echo "========================================"
echo "✅ Task completed!"
echo "========================================"
echo "Results saved to: $RESULTS_DIR"
echo ""
echo "Files created:"
ls -la "$RESULTS_DIR" | grep -v "^d" | grep -v "TASK.md" | grep -v ".mini_config" | grep -v "run_log" | grep -v "trajectory" | grep -v "total" || echo "  (no new files)"
echo ""
echo "📄 Log: $RESULTS_DIR/run_log.txt"
echo "📊 Trajectory: $RESULTS_DIR/trajectory.json"
echo "========================================"
