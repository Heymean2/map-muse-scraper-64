
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trophy } from 'lucide-react';

interface CSVPreviewActionsProps {
  onClose: () => void;
  onDownload?: () => void;
  onUpgrade?: () => void;
  isLimited: boolean;
}

export default function CSVPreviewActions({ 
  onClose, 
  onDownload, 
  onUpgrade, 
  isLimited 
}: CSVPreviewActionsProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onClose}>Close</Button>
      
      {!isLimited && onDownload ? (
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Raw CSV
        </Button>
      ) : isLimited && onUpgrade ? (
        <Button onClick={onUpgrade}>
          <Trophy className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
      ) : null}
    </div>
  );
}
