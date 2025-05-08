
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, List } from "lucide-react";

export default function TasksFilter() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button variant="outline" size="sm">
        <List className="mr-2 h-4 w-4" />
        Group
      </Button>
    </div>
  );
}
