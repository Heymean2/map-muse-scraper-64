
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy } from 'lucide-react';

interface CSVPreviewLimitedNoticeProps {
  maxPreviewRows: number;
  totalCount: number;
  onUpgrade: () => void;
}

export default function CSVPreviewLimitedNotice({ 
  maxPreviewRows, 
  totalCount, 
  onUpgrade 
}: CSVPreviewLimitedNoticeProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-center justify-between">
      <div>
        <p className="font-medium text-yellow-800">Limited Preview</p>
        <p className="text-sm text-yellow-700">
          Showing only {maxPreviewRows} rows out of {totalCount}. Upgrade your plan to access all data.
        </p>
      </div>
      <Button onClick={onUpgrade} size="sm">
        <Trophy className="mr-2 h-4 w-4" />
        Upgrade Now
      </Button>
    </div>
  );
}
