
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo, getUserScrapingTasks } from "@/services/scraper";

export function useDashboardData() {
  // Fetch user's plan information
  const { 
    data: planInfo, 
    isLoading: planLoading 
  } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 30000 // 30 seconds
  });
  
  // Fetch user's scraping tasks
  const { 
    data: tasksData, 
    isLoading: tasksLoading 
  } = useQuery({
    queryKey: ['userScrapingTasks'],
    queryFn: getUserScrapingTasks
  });
  
  // Calculate task metrics
  const completedTasks = tasksData && Array.isArray(tasksData) ? 
    tasksData.filter(task => task.status === 'completed').length : 0;
    
  const processingTasks = tasksData && Array.isArray(tasksData) ? 
    tasksData.filter(task => task.status === 'processing').length : 0;
    
  // Determine plan types
  const isCreditBasedPlan = planInfo?.billing_period === 'credits';
  const isSubscriptionPlan = planInfo?.billing_period === 'monthly' && !planInfo?.isFreePlan;
  const hasBothPlanTypes = planInfo?.hasBothPlanTypes;
  
  return {
    planInfo,
    planLoading,
    tasksData,
    tasksLoading,
    completedTasks,
    processingTasks,
    isCreditBasedPlan,
    isSubscriptionPlan,
    hasBothPlanTypes
  };
}
