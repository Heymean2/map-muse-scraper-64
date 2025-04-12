
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowLeft } from "lucide-react";
import ResultsContent from "@/components/results/ResultsContent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['scrapingResults', taskId],
    queryFn: () => getScrapingResults(taskId),
    enabled: !!taskId,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/result')}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/result')}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
          </div>
          <div className="p-4 border rounded bg-red-50 text-red-700">
            Error loading task results. Please try again later.
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container className="py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/result')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <h1 className="text-2xl font-bold">Task Results</h1>
        </div>

        {data && (
          <ResultsContent 
            loading={false} 
            error={null} 
            taskId={taskId || null} 
            results={data} 
            exportCSV={() => {
              if (data?.result_url) {
                window.open(data.result_url, '_blank');
              }
            }}
            isLimited={data?.limited || false}
            planInfo={data?.current_plan}
          />
        )}
      </Container>
    </DashboardLayout>
  );
}
