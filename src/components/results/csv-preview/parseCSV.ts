
/**
 * Parse CSV string data into a 2D array
 * 
 * Handles quoted values and properly parses CSV format
 */
export function parseCSV(csvText: string): string[][] {
  return csvText.split('\n')
    .filter(row => row.trim().length > 0)
    .map(row => {
      // Handle quoted values with commas
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      return values;
    });
}

/**
 * Get limited rows of CSV data 
 * Only return header + maxPreviewRows
 */
export function getLimitedCSVData(
  rows: string[][], 
  isLimited: boolean = false, 
  maxPreviewRows: number = 5
): string[][] {
  if (isLimited && rows.length > maxPreviewRows + 1) {
    return [rows[0], ...rows.slice(1, maxPreviewRows + 1)];
  }
  return rows;
}
