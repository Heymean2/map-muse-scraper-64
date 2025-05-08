
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface ResultsHeaderProps {
  tasksCount?: number;
}

export default function ResultsHeader({ tasksCount }: ResultsHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Results</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-2xl font-bold">Scraping Results</h1>
        <Button onClick={() => navigate('/dashboard/scrape')}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
    </div>
  );
}
