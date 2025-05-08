
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadCsvFromUrl } from '@/services/scraper';

// Import our new components
import CSVPreviewModal from './csv-preview/CSVPreviewModal';
import CSVPreviewLoading from './csv-preview/CSVPreviewLoading';
import CSVPreviewError from './csv-preview/CSVPreviewError';
import CSVPreviewTable from './csv-preview/CSVPreviewTable';
import CSVPreviewRaw from './csv-preview/CSVPreviewRaw';
import CSVPreviewLimitedNotice from './csv-preview/CSVPreviewLimitedNotice';
import CSVPreviewActions from './csv-preview/CSVPreviewActions';
import { parseCSV, getLimitedCSVData } from './csv-preview/parseCSV';

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
  
  if (isLoading) {
    return (
      <CSVPreviewModal onClose={onClose}>
        <CSVPreviewLoading />
      </CSVPreviewModal>
    );
  }
  
  if (error) {
    return (
      <CSVPreviewModal onClose={onClose}>
        <CSVPreviewError 
          error={error} 
          onClose={onClose} 
          onDownload={!isLimited ? handleDownload : undefined} 
          isLimited={isLimited} 
        />
      </CSVPreviewModal>
    );
  }
  
  return (
    <CSVPreviewModal onClose={onClose}>
      {isLimited && (
        <CSVPreviewLimitedNotice 
          maxPreviewRows={maxPreviewRows} 
          totalCount={totalCount} 
          onUpgrade={handleUpgrade} 
        />
      )}
      
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="raw">Raw Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="w-full">
          {csvData.length > 0 ? (
            <CSVPreviewTable
              csvData={csvData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              isLimited={isLimited}
            />
          ) : (
            <div className="text-center py-8">No data available</div>
          )}
        </TabsContent>
        
        <TabsContent value="raw">
          <CSVPreviewRaw csvData={csvData} isLimited={isLimited} />
        </TabsContent>
      </Tabs>
      
      <CSVPreviewActions 
        onClose={onClose} 
        onDownload={!isLimited ? handleDownload : undefined}
        onUpgrade={isLimited ? handleUpgrade : undefined}
        isLimited={isLimited}
      />
    </CSVPreviewModal>
  );
}
