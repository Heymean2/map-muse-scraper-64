
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface CSVPreviewModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CSVPreviewModal({ 
  title = "CSV Preview", 
  onClose, 
  children 
}: CSVPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}><X /></Button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
