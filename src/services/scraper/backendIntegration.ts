
import { toast } from "sonner";
import { hasTaskBeenSent, markTaskAsSent } from "./requestTracker";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://map-nine-omega.vercel.app";
const CHECK_REQUEST_ENDPOINT = "/check_request";

/**
 * Sends the task details to the external backend for processing
 * Includes deduplication to prevent the same task being sent multiple times
 * 
 * @param userId - The ID of the user who created the task
 * @param taskId - The ID of the created scraping task
 * @returns Promise<boolean> - Whether the request was successful
 */
export async function sendTaskToBackend(userId: string, taskId: string): Promise<boolean> {
  try {
    // Check if we've already sent this task to prevent duplicates
    if (hasTaskBeenSent(taskId)) {
      console.log(`Task ${taskId} already sent to backend, skipping duplicate request`);
      return true; // Return true since task was already processed
    }
    
    console.log(`Sending task ${taskId} to external backend for user ${userId}`);
    
    const endpoint = `${BACKEND_BASE_URL}${CHECK_REQUEST_ENDPOINT}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        task_id: taskId
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Error response from backend: ${response.status} - ${errorText}`);
      return false;
    }
    
    console.log(`Successfully sent task ${taskId} to external backend`);
    
    // Mark the task as sent to prevent duplicate requests
    markTaskAsSent(taskId);
    
    return true;
  } catch (error) {
    console.error("Failed to send task to external backend:", error);
    return false;
  }
}

/**
 * Refreshes task data from Supabase without sending to backend
 * This function is a placeholder that will be used by the TaskDetail component
 * 
 * @param taskId - The ID of the task to refresh
 * @returns Promise<void>
 */
export async function refreshTaskData(taskId: string): Promise<void> {
  console.log(`Refreshing local data for task ${taskId} without backend request`);
  // This function intentionally does nothing - it's just to provide a
  // consistent API that doesn't trigger backend requests
}
