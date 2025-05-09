
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadCsvFromUrl } from '@/services/scraper';
import { Button } from '@/components/ui/button';
import { Download, X, Code, Table as TableIcon, Trophy } from 'lucide-react';

// Import our components
import CSVPreviewLoading from './csv-preview/CSVPreviewLoading';
import CSVPreviewError from './csv-preview/CSVPreviewError';
import CSVPreviewTable from './csv-preview/CSVPreviewTable';
import CSVPreviewRaw from './csv-preview/CSVPreviewRaw';
import { parseCSV, getLimitedCSVData } from './csv-preview/parseCSV';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CSVPreviewProps {
  url: string;
  onClose: () => void;
  isLimited?: boolean;
  totalCount?: number;
  maxPreviewRows?: number;
}

export default function CSVPreview({ 
  url, 
  onClose, 
  isLimited = false, 
  totalCount = 0,
  maxPreviewRows = 5
}: CSVPreviewProps) {
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
        const rows = parseCSV(csvText);
        
        // If limited, only show header + maxPreviewRows rows
        const displayRows = getLimitedCSVData(rows, isLimited, maxPreviewRows);
          
        setCsvData(displayRows);
      } catch (err) {
        console.error('Error loading CSV:', err);
        setError('Failed to load CSV data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCsvData();
  }, [url, isLimited, maxPreviewRows]);
  
  const handleDownload = () => {
    window.open(url, '_blank');
  };
  
  const handleUpgrade = () => {
    navigate("/dashboard/billing");
    onClose();
  };

  return (
    <Card className="animate-fade-in shadow-md border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-xl">CSV Data Preview</CardTitle>
          <CardDescription>
            {isLimited ? `Showing ${maxPreviewRows} rows preview` : 'Raw data from your scraping task'}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <CSVPreviewLoading />
        ) : error ? (
          <CSVPreviewError 
            error={error} 
            onClose={onClose} 
            onDownload={!isLimited ? handleDownload : undefined} 
            isLimited={isLimited} 
          />
        ) : (
          <>
            {isLimited && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-800">Limited Preview</p>
                  <p className="text-sm text-yellow-700">
                    Showing only {maxPreviewRows} rows out of {totalCount}. Upgrade your plan to access all data.
                  </p>
                </div>
                <Button onClick={handleUpgrade} size="sm" className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  Upgrade
                </Button>
              </div>
            )}
            
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4 w-full sm:w-auto">
                <TabsTrigger value="table" className="flex items-center gap-1">
                  <TableIcon className="h-4 w-4" />
                  <span>Table View</span>
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>Raw Text</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="table" className="w-full">
                {csvData.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <CSVPreviewTable
                      csvData={csvData}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      rowsPerPage={rowsPerPage}
                      isLimited={isLimited}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No data available</div>
                )}
              </TabsContent>
              
              <TabsContent value="raw">
                <CSVPreviewRaw csvData={csvData} isLimited={isLimited} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Close</Button>
        
        {!isLimited && !isLoading && !error ? (
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        ) : isLimited && !isLoading && !error ? (
          <Button onClick={handleUpgrade} className="gap-2">
            <Trophy className="h-4 w-4" />
            Upgrade Now
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
