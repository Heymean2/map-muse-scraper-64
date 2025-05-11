
import { DashboardHeader } from "./components/DashboardHeader";
import { StatusCards } from "./components/StatusCards";
import { ActionCards } from "./components/ActionCards";
import { useDashboardData } from "./hooks/useDashboardData";

export default function DashboardHome() {
  // Get all dashboard data using our custom hook
  const {
    planInfo,
    planLoading,
    completedTasks,
    processingTasks,
    tasksLoading,
    isCreditBasedPlan,
    isSubscriptionPlan,
    hasBothPlanTypes
  } = useDashboardData();
  
  return (
    <div className="w-full px-4 md:px-0">
      <DashboardHeader />
      
      <StatusCards 
        planInfo={planInfo} 
        planLoading={planLoading}
        completedTasks={completedTasks}
        processingTasks={processingTasks}
        tasksLoading={tasksLoading}
        isCreditBasedPlan={isCreditBasedPlan}
        hasBothPlanTypes={hasBothPlanTypes}
        isSubscriptionPlan={isSubscriptionPlan}
      />
      
      <ActionCards 
        planInfo={planInfo}
        isCreditBasedPlan={isCreditBasedPlan}
        isSubscriptionPlan={isSubscriptionPlan}
        hasBothPlanTypes={hasBothPlanTypes}
      />
    </div>
  );
}
