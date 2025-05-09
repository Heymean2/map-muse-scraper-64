
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Tag, Star, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SearchInfoCardProps {
  searchInfo: {
    keywords?: string;
    location?: string;
    fields?: string[] | string;
    rating?: string;
  };
  totalCount: number;
  completedAt?: string;
}

export default function SearchInfoCard({ 
  searchInfo, 
  totalCount, 
  completedAt 
}: SearchInfoCardProps) {
  // Helper function to ensure fields is always handled as an array
  const getFieldsArray = () => {
    if (!searchInfo?.fields) return [];
    if (Array.isArray(searchInfo.fields)) return searchInfo.fields;
    if (typeof searchInfo.fields === 'string') {
      // Handle comma-separated string
      return searchInfo.fields.split(',').map(field => field.trim());
    }
    return [String(searchInfo.fields)]; // Convert non-string to string and wrap in array
  };

  const fieldsArray = getFieldsArray();
  
  return (
    <Card className="bg-slate-50 dark:bg-slate-800">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Search Information</h3>
            <div className="space-y-1">
              {searchInfo?.keywords && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">{searchInfo.keywords}</span>
                </div>
              )}
              
              {searchInfo?.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">{searchInfo.location}</span>
                </div>
              )}
              
              {fieldsArray.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3.5 w-3.5 flex items-center justify-center text-slate-500">
                    <span className="text-xs font-mono">[]</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">
                    {fieldsArray.join(', ')}
                  </span>
                </div>
              )}
              
              {searchInfo?.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">Min rating: {searchInfo.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Results</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3.5 w-3.5 flex items-center justify-center text-slate-500">
                  <span className="text-xs">#</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{totalCount} results found</span>
              </div>
              
              {completedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Completed {format(new Date(completedAt), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
