
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsErrorStateProps {
  error: string;
}

export default function ResultsErrorState({ error }: ResultsErrorStateProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg border border-red-200 dark:border-red-800 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">Error Loading Results</h3>
      <p className="text-red-700 dark:text-red-400 mb-6">{error}</p>
      <Button onClick={handleRefresh} variant="outline" className="border-red-300">
        Try Again
      </Button>
    </div>
  );
}
