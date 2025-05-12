
/**
 * Utility to track which tasks have been sent to the external backend
 * to prevent duplicate requests
 */

const SENT_TASKS_KEY = 'mapScraper_sentTasks';

/**
 * Check if a task has already been sent to the external backend
 * 
 * @param taskId - The ID of the task to check
 * @returns boolean - Whether the task has already been sent
 */
export function hasTaskBeenSent(taskId: string): boolean {
  try {
    const sentTasksJson = localStorage.getItem(SENT_TASKS_KEY);
    if (!sentTasksJson) return false;
    
    const sentTasks: string[] = JSON.parse(sentTasksJson);
    return sentTasks.includes(taskId);
  } catch (error) {
    console.error("Error checking task sent status:", error);
    return false;
  }
}

/**
 * Mark a task as sent to the external backend
 * 
 * @param taskId - The ID of the task to mark as sent
 */
export function markTaskAsSent(taskId: string): void {
  try {
    const sentTasksJson = localStorage.getItem(SENT_TASKS_KEY);
    const sentTasks: string[] = sentTasksJson ? JSON.parse(sentTasksJson) : [];
    
    if (!sentTasks.includes(taskId)) {
      sentTasks.push(taskId);
      localStorage.setItem(SENT_TASKS_KEY, JSON.stringify(sentTasks));
    }
  } catch (error) {
    console.error("Error marking task as sent:", error);
  }
}

/**
 * Clear the sent task history (useful for testing)
 */
export function clearSentTasksHistory(): void {
  localStorage.removeItem(SENT_TASKS_KEY);
}
