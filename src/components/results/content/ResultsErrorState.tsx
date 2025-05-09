
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsErrorStateProps {
  error: string;
}

export default function ResultsErrorState({ error }: ResultsErrorStateProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-8 text-center flex flex-col items-center">
        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Results</h3>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
