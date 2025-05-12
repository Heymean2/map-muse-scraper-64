
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface HeaderNavigationProps {
  onRefresh: () => void;
}

export default function HeaderNavigation({ onRefresh }: HeaderNavigationProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-white/30 gap-1"
        asChild
      >
        <Link to="/dashboard/results">
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Link>
      </Button>
      
      <Button 
        onClick={onRefresh}
        size="sm"
        variant="outline"
        className="gap-2"
        title="Refresh data from database"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Refresh</span>
      </Button>
    </div>
  );
}
