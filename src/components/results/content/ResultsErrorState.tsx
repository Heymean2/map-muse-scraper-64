
import React from 'react';

interface ResultsErrorStateProps {
  error: string;
}

export default function ResultsErrorState({ error }: ResultsErrorStateProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
      <p className="text-red-700 dark:text-red-400">{error}</p>
    </div>
  );
}
