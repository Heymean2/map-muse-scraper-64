
/**
 * Download CSV file from result_url
 */
export async function downloadCsvFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    return csvText;
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
}
