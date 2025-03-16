
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, X, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadCsvFromUrl } from '@/services/scraper';
import { useNavigate } from 'react-router-dom';

interface CSVPreviewProps {
  url: string;
  onClose: () => void;
  isLimited?: boolean;
  totalCount?: number;
}

export default function CSVPreview({ url, onClose, isLimited = false, totalCount = 0 }: CSVPreviewProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCsvData() {
      try {
        setIsLoading(true);
        const csvText = await downloadCsvFromUrl(url);
        
        // Parse CSV into array
        const rows = csvText.split('\n')
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
          
        // If limited, only show header + 5 rows
        let displayRows = rows;
        if (isLimited && rows.length > 6) { // Header + 5 rows
          displayRows = [rows[0], ...rows.slice(1, 6)];
        }
          
        setCsvData(displayRows);
      } catch (err) {
        console.error('Error loading CSV:', err);
        setError('Failed to load CSV data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCsvData();
  }, [url, isLimited]);
  
  // Calculate pagination values
  const totalRows = isLimited ? 5 : (csvData.length - 1);
  const totalPages = Math.ceil(totalRows / rowsPerPage); // -1 for header row
  const startIndex = (currentPage - 1) * rowsPerPage + 1; // +1 to skip header
  const endIndex = Math.min(startIndex + rowsPerPage, csvData.length);
  
  const handleDownload = () => {
    window.open(url, '_blank');
  };
  
  const handleUpgrade = () => {
    navigate("/dashboard/billing");
    onClose();
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">CSV Preview</h3>
            <Button variant="ghost" size="sm" onClick={onClose}><X /></Button>
          </div>
          <div className="py-20 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading CSV data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">CSV Preview</h3>
            <Button variant="ghost" size="sm" onClick={onClose}><X /></Button>
          </div>
          <div className="py-8 text-center text-red-500">
            {error}
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {!isLimited && (
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Raw CSV
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">CSV Preview</h3>
          <Button variant="ghost" size="sm" onClick={onClose}><X /></Button>
        </div>
        
        {isLimited && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800">Limited Preview</p>
              <p className="text-sm text-yellow-700">
                Showing only 5 rows out of {totalCount}. Upgrade your plan to access all data.
              </p>
            </div>
            <Button onClick={handleUpgrade} size="sm">
              <Trophy className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        )}
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="raw">Raw Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="w-full">
            {csvData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-slate-100">
                      <tr>
                        {csvData[0].map((header, i) => (
                          <th key={i} className="border border-gray-200 px-3 py-2 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(startIndex, endIndex).map((row, rowIndex) => (
                        <tr key={rowIndex + startIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-200 px-3 py-2 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {totalPages > 1 && !isLimited && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Showing rows {startIndex} to {endIndex - 1} of {csvData.length - 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(current => Math.max(current - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm px-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(current => Math.min(current + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {isLimited && (
                  <div className="flex justify-center mt-4">
                    <p className="text-sm text-gray-500">
                      {csvData.length - 1} rows shown (limited preview)
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">No data available</div>
            )}
          </TabsContent>
          
          <TabsContent value="raw">
            <div className="bg-slate-100 p-4 rounded-md overflow-x-auto">
              <pre className="text-xs">{csvData.map(row => row.join(',')).join('\n')}</pre>
            </div>
            
            {isLimited && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700 text-center">
                Showing limited preview data only.
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          
          {!isLimited ? (
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Raw CSV
            </Button>
          ) : (
            <Button onClick={handleUpgrade}>
              <Trophy className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
