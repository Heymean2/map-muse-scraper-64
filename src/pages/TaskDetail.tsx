
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import TaskDetailLayout from "@/components/results/layout/TaskDetailLayout";
import TaskHeader from "@/components/results/task-detail/TaskHeader";
import TaskContent from "@/components/results/task-detail/TaskContent";
import TaskDetailLoading from "@/components/results/task-detail/TaskDetailLoading";
import TaskDetailError from "@/components/results/task-detail/TaskDetailError";
import TaskDetailNoData from "@/components/results/task-detail/TaskDetailNoData";
import { TaskDetailProvider, useTaskDetail } from "@/components/results/task-detail/context/TaskDetailProvider";

// This component renders the task detail with the context data
function TaskDetailContent() {
  const { taskId, taskResults, isLoading, error, handleRefresh, taskData } = useTaskDetail();
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {taskData && (
        <TaskHeader 
          title={taskData.keywords || "Task Details"}
          status={taskData.status}
          stage={taskData.stage}
          createdAt={taskData.createdAt}
          location={taskData.searchInfo?.location}
          fields={taskData.fields}
          resultUrl={taskData.resultUrl}
          onRefresh={handleRefresh}
        />
      )}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TaskDetailLoading />
        ) : error ? (
          <TaskDetailError onRetry={handleRefresh} />
        ) : taskData ? (
          <TaskContent 
            taskId={taskId || null}
            results={taskResults}
            isLoading={isLoading}
            error={error}
            isLimited={taskData.isLimited || false}
            planInfo={taskData.currentPlan}
          />
        ) : (
          <TaskDetailNoData />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main container component with context provider
export default function TaskDetail() {
  return (
    <TaskDetailLayout>
      <TaskDetailProvider>
        <TaskDetailContent />
      </TaskDetailProvider>
    </TaskDetailLayout>
  );
}
