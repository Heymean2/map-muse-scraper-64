
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

interface ResultsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ResultsTabs({ activeTab, setActiveTab }: ResultsTabsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger value="table" onClick={() => setActiveTab("table")}>Table View</TabsTrigger>
        <TabsTrigger value="cards" onClick={() => setActiveTab("cards")}>Card View</TabsTrigger>
        <TabsTrigger value="stats" onClick={() => setActiveTab("stats")}>Stats</TabsTrigger>
      </TabsList>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Filter size={14} />
          <span>Filter</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Download size={14} />
          <span>Export CSV</span>
        </Button>
      </div>
    </div>
  );
}
