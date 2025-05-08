
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyTasksList() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12 border rounded-lg">
      <h3 className="text-xl font-medium mb-2">No scraping tasks found</h3>
      <p className="text-slate-500 mb-6">Create your first task to get started</p>
      <Button 
        onClick={() => navigate('/dashboard/scrape')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Scraping Task
      </Button>
    </div>
  );
}
