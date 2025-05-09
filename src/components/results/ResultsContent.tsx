
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import CSVPreview from "./CSVPreview";
import JSONPreview from "./JSONPreview";
import ResultsLoadingState from "./content/ResultsLoadingState";
import ResultsErrorState from "./content/ResultsErrorState";
import ResultsStatusCard from "./content/ResultsStatusCard";
import ResultsEmptyState from "./content/ResultsEmptyState";
import ResultsTabbedContent from "./content/ResultsTabbedContent";

interface ResultsContentProps {
  loading: boolean;
  error: string | null;
  taskId: string | null;
  results: any;
  exportCSV: () => void;
  isLimited?: boolean;
  planInfo?: any;
}

export default function ResultsContent({ 
  loading, 
  error, 
  taskId, 
  results, 
  exportCSV,
  isLimited = false,
  planInfo
}: ResultsContentProps) {
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    navigate("/dashboard/billing");
    toast({
      title: "Let's upgrade your plan!",
      description: "Access all your data and continue scraping with our Pro plan.",
    });
  };
  
  // Function to handle JSON export
  const exportJSON = () => {
    if (results?.json_result_url) {
      window.open(results.json_result_url, '_blank');
    } else {
      toast({
        title: "JSON export not available",
        description: "This task doesn't have a JSON export available.",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return <ResultsLoadingState />;
  }

  if (error) {
    return <ResultsErrorState error={error} />;
  }

  if (results?.status === "processing") {
    return (
      <ResultsStatusCard 
        status="processing"
        created_at={results?.created_at}
        search_info={results?.search_info}
        onShowCsvPreview={() => setShowCsvPreview(true)}
        onShowJsonPreview={() => setShowJsonPreview(true)}
        onDownload={exportCSV}
        onDownloadJson={exportJSON}
        isLimited={isLimited}
        result_url={results?.result_url}
        json_result_url={results?.json_result_url}
      />
    );
  }

  if (results?.status === "completed" && (!results?.data || !results?.data?.length)) {
    return (
      <ResultsStatusCard 
        status="completed"
        created_at={results?.created_at}
        search_info={results?.search_info}
        total_count={results?.total_count || 0}
        result_url={results?.result_url}
        json_result_url={results?.json_result_url}
        updated_at={results?.updated_at}
        onShowCsvPreview={() => setShowCsvPreview(true)}
        onShowJsonPreview={() => setShowJsonPreview(true)}
        onDownload={exportCSV}
        onDownloadJson={exportJSON}
        isLimited={isLimited}
      />
    );
  }

  if (!results?.data?.length) {
    return <ResultsEmptyState />;
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-md animate-fade-in">
      <ResultsTabbedContent 
        data={results.data}
        searchInfo={results.search_info}
        totalCount={results.total_count || 0}
        isLimited={isLimited}
        resultUrl={results.result_url}
        jsonResultUrl={results.json_result_url}
        exportCsv={exportCSV}
        exportJson={exportJSON}
        updated_at={results.updated_at}
        onShowCsvPreview={() => setShowCsvPreview(true)}
        onShowJsonPreview={() => setShowJsonPreview(true)}
      />
      
      {showCsvPreview && results.result_url && (
        <CSVPreview 
          url={results.result_url} 
          onClose={() => setShowCsvPreview(false)}
          isLimited={isLimited}
          totalCount={results.total_count || 0}
          maxPreviewRows={isLimited ? 5 : undefined}
        />
      )}
      
      {showJsonPreview && results.json_result_url && (
        <JSONPreview 
          url={results.json_result_url} 
          onClose={() => setShowJsonPreview(false)}
          isLimited={isLimited}
          totalCount={results.total_count || 0}
          maxPreviewRows={isLimited ? 5 : undefined}
        />
      )}
    </Card>
  );
}
