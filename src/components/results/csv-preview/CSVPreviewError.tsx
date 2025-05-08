
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface CSVPreviewErrorProps {
  error: string;
  onClose: () => void;
  onDownload?: () => void;
  isLimited?: boolean;
}

export default function CSVPreviewError({ 
  error, 
  onClose, 
  onDownload, 
  isLimited = false 
}: CSVPreviewErrorProps) {
  return (
    <>
      <div className="py-8 text-center text-red-500">
        {error}
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
        {!isLimited && onDownload && (
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Raw CSV
          </Button>
        )}
      </div>
    </>
  );
}
