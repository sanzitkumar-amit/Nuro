import asyncio
import logging
from database import update_task, get_task

logger = logging.getLogger("neuro.task_worker")

async def run_background_task(task_id: str):
    """
    Executes a multi-step background task asynchronously without blocking main thread.
    Updates step status and final result in SQLite task_queue.
    """
    task = await get_task(task_id)
    if not task:
        logger.error(f"Task {task_id} not found.")
        return

    steps = task["steps"]
    total_steps = len(steps)
    results_collected = []

    await update_task(task_id, current_step=0, status="in_progress", result="Starting multi-step execution...")

    for i, step_desc in enumerate(steps):
        # Update progress to current step
        step_idx = i + 1
        status_msg = f"Step {step_idx}/{total_steps}: {step_desc}..."
        await update_task(task_id, current_step=step_idx, status="in_progress", result="\n".join(results_collected + [f"⌛ {status_msg}"]))
        
        # Simulate processing step with realistic delay
        await asyncio.sleep(2.5)
        
        step_result = f"✓ Completed Step {step_idx}: {step_desc}"
        results_collected.append(step_result)

    # Finalize completed task
    final_output = f"🎯 Multi-Step Task '{task['title']}' Completed Successfully!\n\nSummary:\n" + "\n".join(results_collected)
    await update_task(task_id, current_step=total_steps, status="completed", result=final_output)

def launch_task_in_background(task_id: str):
    """Helper to schedule async task execution in the event loop."""
    asyncio.create_task(run_background_task(task_id))
