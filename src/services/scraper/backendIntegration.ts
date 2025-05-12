
import { toast } from "sonner";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://tender-socks-cry.loca.lt";
const CHECK_REQUEST_ENDPOINT = "/check_request";

/**
 * Sends the task details to the external backend for processing
 * 
 * @param userId - The ID of the user who created the task
 * @param taskId - The ID of the created scraping task
 * @returns Promise<boolean> - Whether the request was successful
 */
export async function sendTaskToBackend(userId: string, taskId: string): Promise<boolean> {
  try {
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
    return true;
  } catch (error) {
    console.error("Failed to send task to external backend:", error);
    return false;
  }
}
