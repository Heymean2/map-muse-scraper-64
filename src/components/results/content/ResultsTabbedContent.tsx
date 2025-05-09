
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardHeader, CardContent } from "@/components/ui/card";
import { BarChart, MapPin, Table, Lock, FileJson, FileSpreadsheet } from "lucide-react";
import ResultsTable from "../ResultsTable";
import ResultsAnalyticsView from "./ResultsAnalyticsView";
import ResultsMapView from "./ResultsMapView";
import SearchInfoCard from "../SearchInfoCard";
import ResultsDataHeader from "./ResultsDataHeader";

interface ResultsTabbedContentProps {
  data: any[];
  searchInfo: any;
  totalCount: number;
  isLimited: boolean;
  resultUrl?: string;
  jsonResultUrl?: string;
  exportCsv: () => void;
  exportJson: () => void;
  updated_at?: string;
  onShowCsvPreview: () => void;
  onShowJsonPreview: () => void;
}

export default function ResultsTabbedContent({
  data,
  searchInfo,
  totalCount,
  isLimited,
  resultUrl,
  jsonResultUrl,
  exportCsv,
  exportJson,
  updated_at,
  onShowCsvPreview,
  onShowJsonPreview
}: ResultsTabbedContentProps) {
  const [activeView, setActiveView] = useState("table");
  const [activeFormat, setActiveFormat] = useState<"csv" | "json">("csv");
  
  // Limit data to 5 rows if user has exceeded free tier
  const getLimitedData = () => {
    if (!data) return [];
    
    if (isLimited && Array.isArray(data) && data.length > 5) {
      return data.slice(0, 5);
    }
    
    return data;
  };

  // Ensure fields is always an array before using join method
  const ensureArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Handle comma-separated string
      return value.split(',').map(item => item.trim());
    }
    if (value === null || value === undefined) return [];
    return [String(value)]; // Convert single value to array
  };

  const handleFormatToggle = (format: "csv" | "json") => {
    setActiveFormat(format);
  };

  const handleExport = () => {
    if (activeFormat === "csv") {
      exportCsv();
    } else {
      exportJson();
    }
  };

  const handleShowPreview = () => {
    if (activeFormat === "csv") {
      onShowCsvPreview();
    } else {
      onShowJsonPreview();
    }
  };

  return (
    <>
      <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
        <ResultsDataHeader 
          title="Task Results" 
          description={`Showing data for "${searchInfo?.keywords}" (${totalCount} results)`}
          isLimited={isLimited}
          resultUrl={activeFormat === "csv" ? resultUrl : jsonResultUrl}
          onExportCsv={handleExport}
        />
        
        {/* Format selector */}
        {(resultUrl || jsonResultUrl) && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-slate-500">Format:</span>
            <div className="inline-flex items-center rounded-md border border-slate-200 bg-white">
              <button
                onClick={() => handleFormatToggle("csv")}
                className={`flex items-center gap-1 px-3 py-1 text-sm ${
                  activeFormat === "csv" 
                    ? "bg-slate-100 text-slate-900 font-medium" 
                    : "text-slate-600 hover:bg-slate-50"
                } rounded-l-md transition-colors`}
                disabled={!resultUrl}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleFormatToggle("json")}
                className={`flex items-center gap-1 px-3 py-1 text-sm ${
                  activeFormat === "json" 
                    ? "bg-slate-100 text-slate-900 font-medium" 
                    : "text-slate-600 hover:bg-slate-50"
                } rounded-r-md transition-colors border-l`}
                disabled={!jsonResultUrl}
              >
                <FileJson className="h-3.5 w-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        )}
        
        {isLimited && (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm font-medium mt-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-md border border-yellow-200 dark:border-yellow-800">
            <Lock className="h-3 w-3" />
            <span>Showing limited preview (5 rows)</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="table" className="flex items-center gap-1">
                <Table className="h-4 w-4" />
                <span>Table View</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              {searchInfo?.location && (
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Map View</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="table" className="mt-4 px-6">
            <ResultsTable 
              data={getLimitedData()} 
              searchInfo={searchInfo}
              totalCount={totalCount}
              isLimited={isLimited}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4 px-6">
            <ResultsAnalyticsView isLimited={isLimited} />
          </TabsContent>
          
          <TabsContent value="map" className="mt-4 px-6">
            <ResultsMapView isLimited={isLimited} />
          </TabsContent>
          
          <div className="px-6 pb-6">
            <div className="mt-6">
              <SearchInfoCard 
                totalCount={totalCount} 
                searchInfo={{
                  keywords: searchInfo?.keywords,
                  location: searchInfo?.location,
                  fields: searchInfo?.fields, // The fields property will be properly handled in SearchInfoCard
                  rating: searchInfo?.rating
                }}
                completedAt={updated_at}
              />
            </div>
          </div>
        </Tabs>
      </CardContent>
    </>
  );
}
