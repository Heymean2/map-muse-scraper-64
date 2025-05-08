
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Download, Trophy, Lock } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ResultsDataHeaderProps {
  title: string;
  description: string;
  isLimited: boolean;
  resultUrl?: string;
  onExportCsv: () => void;
}

export default function ResultsDataHeader({
  title,
  description,
  isLimited,
  resultUrl,
  onExportCsv
}: ResultsDataHeaderProps) {
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    navigate("/dashboard/billing");
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </div>
      
      <div className="flex gap-2">
        {resultUrl && !isLimited && (
          <Button 
            variant="outline" 
            onClick={() => window.open(resultUrl, '_blank')}
            className="gap-1 text-sm"
          >
            <FileDown className="h-4 w-4" />
            <span>Raw CSV</span>
          </Button>
        )}
        
        {resultUrl && !isLimited && (
          <Button 
            onClick={onExportCsv}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
        
        {isLimited && (
          <Button 
            onClick={handleUpgradeClick}
            className="gap-1"
          >
            <Trophy className="h-4 w-4" />
            Upgrade Now
          </Button>
        )}
      </div>
    </div>
  );
}
