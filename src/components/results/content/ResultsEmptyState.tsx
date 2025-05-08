
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function ResultsEmptyState() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center gap-4">
          <AlertTriangle className="h-10 w-10 text-yellow-500" />
          <div>
            <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-400 mb-1">No Results Found</h3>
            <p className="text-yellow-700 dark:text-yellow-400">
              This could be because the task is still processing or no data matched your criteria.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
