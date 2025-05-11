
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TaskNoDataStateProps {
  message?: string;
}

export default function TaskNoDataState({ message = "We couldn't find any information for this task." }: TaskNoDataStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <Card className="p-5">
        <h3 className="text-lg font-medium mb-2">No Task Data Available</h3>
        <p className="mb-4">{message}</p>
        <Button onClick={() => navigate('/result')}>
          Return to Results
        </Button>
      </Card>
    </div>
  );
}
