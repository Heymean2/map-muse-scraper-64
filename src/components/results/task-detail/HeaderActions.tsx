
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface HeaderActionsProps {
  resultUrl?: string;
}

export default function HeaderActions({ resultUrl }: HeaderActionsProps) {
  if (!resultUrl) return null;
  
  return (
    <div className="flex items-center gap-3">
      <Button 
        className="gap-2"
        onClick={() => window.open(resultUrl, '_blank')}
      >
        <Download className="h-4 w-4" />
        <span>Export CSV</span>
      </Button>
      
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        }}
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
    </div>
  );
}
