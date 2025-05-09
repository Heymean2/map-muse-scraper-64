
import React from 'react';

interface JSONPreviewRawProps {
  jsonData: any[];
  isLimited: boolean;
}

export default function JSONPreviewRaw({ jsonData, isLimited }: JSONPreviewRawProps) {
  return (
    <>
      <div className="bg-slate-100 p-4 rounded-md overflow-x-auto">
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
      
      {isLimited && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700 text-center">
          Showing limited preview data only.
        </div>
      )}
    </>
  );
}
