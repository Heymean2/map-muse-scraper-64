
import React from 'react';

export default function JSONPreviewLoading() {
  return (
    <div className="py-20 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading JSON data...</p>
    </div>
  );
}
