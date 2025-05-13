
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import TaskDetailLayout from "@/components/results/layout/TaskDetailLayout";
import ModernTaskHeader from "@/components/results/task-detail/ModernTaskHeader";
import TaskDetailLoading from "@/components/results/task-detail/TaskDetailLoading";
import TaskDetailError from "@/components/results/task-detail/TaskDetailError";
import TaskDetailNoData from "@/components/results/task-detail/TaskDetailNoData";
import TabbedTaskContent from "@/components/results/task-detail/TabbedTaskContent";
import { TaskDetailProvider, useTaskDetail } from "@/components/results/task-detail/context/TaskDetailProvider";

// This component renders the task detail with the context data
function TaskDetailContent() {
  const { taskId, taskResults, isLoading, error, handleRefresh, taskData } = useTaskDetail();
  const [activeTab, setActiveTab] = useState(taskResults?.status === "processing" ? "progress" : "data");
  
  // Get export handlers
  const handleExportCsv = () => {
    if (taskResults && taskResults.result_url) {
      window.open(taskResults.result_url, '_blank');
    }
  };
  
  const handleExportJson = () => {
    if (taskResults && taskResults.json_result_url) {
      window.open(taskResults.json_result_url, '_blank');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {taskData && (
        <ModernTaskHeader 
          title={taskData.keywords || "Task Details"}
          status={taskData.status}
          stage={taskData.stage}
          createdAt={taskData.createdAt}
          location={taskData.searchInfo?.location}
          fields={taskData.fields}
          resultUrl={taskData.resultUrl}
          onRefresh={handleRefresh}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TaskDetailLoading />
        ) : error ? (
          <TaskDetailError onRetry={handleRefresh} />
        ) : taskData ? (
          <TabbedTaskContent 
            taskId={taskId || null}
            results={taskResults}
            isLoading={isLoading}
            error={error}
            isLimited={taskData.isLimited || false}
            planInfo={taskData.currentPlan}
            activeTab={activeTab}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
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
