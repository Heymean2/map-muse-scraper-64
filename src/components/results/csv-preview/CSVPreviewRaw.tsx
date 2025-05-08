
import React from 'react';

interface CSVPreviewRawProps {
  csvData: string[][];
  isLimited: boolean;
}

export default function CSVPreviewRaw({ csvData, isLimited }: CSVPreviewRawProps) {
  return (
    <>
      <div className="bg-slate-100 p-4 rounded-md overflow-x-auto">
        <pre className="text-xs">{csvData.map(row => row.join(',')).join('\n')}</pre>
      </div>
      
      {isLimited && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700 text-center">
          Showing limited preview data only.
        </div>
      )}
    </>
  );
}
