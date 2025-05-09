
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapPin, Tag, Star, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface TaskInfoCardProps {
  searchInfo?: {
    keywords?: string;
    location?: string;
    fields?: string[] | string;
    rating?: string;
  };
  totalCount: number;
  completedAt?: string;
  taskStatus?: string;
}

export default function TaskInfoCard({
  searchInfo,
  totalCount,
  completedAt,
  taskStatus = "completed"
}: TaskInfoCardProps) {
  // Helper function to ensure fields is always handled as an array
  const getFieldsArray = () => {
    if (!searchInfo?.fields) return [];
    if (Array.isArray(searchInfo.fields)) return searchInfo.fields;
    if (typeof searchInfo.fields === 'string') {
      return searchInfo.fields.split(',').map(field => field.trim());
    }
    return [String(searchInfo.fields)]; // Convert non-string to string and wrap in array
  };

  const fieldsArray = getFieldsArray();
  
  const getStatusIcon = () => {
    switch (taskStatus) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (taskStatus) {
      case "completed":
        return "Task completed successfully";
      case "processing":
        return "Task is currently processing";
      case "failed":
        return "Task failed to complete";
      default:
        return "Unknown status";
    }
  };
  
  const getStatusColor = () => {
    switch (taskStatus) {
      case "completed":
        return "text-green-700 bg-green-50";
      case "processing":
        return "text-blue-700 bg-blue-50";
      case "failed":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <CardTitle className="text-lg font-medium">Task Information</CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className={`p-4 rounded-lg flex items-center gap-3 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
      
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Search Query</h3>
          <div className="space-y-3">
            {searchInfo?.keywords && (
              <motion.div 
                className="flex gap-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center rounded-md bg-indigo-100 p-1.5 text-indigo-600">
                  <Tag className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">Keywords</div>
                  <div className="font-medium text-gray-800">{searchInfo.keywords}</div>
                </div>
              </motion.div>
            )}
            
            {searchInfo?.location && (
              <motion.div 
                className="flex gap-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center rounded-md bg-green-100 p-1.5 text-green-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">Location</div>
                  <div className="font-medium text-gray-800">{searchInfo.location}</div>
                </div>
              </motion.div>
            )}
            
            {fieldsArray.length > 0 && (
              <motion.div 
                className="flex gap-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center rounded-md bg-purple-100 p-1.5 text-purple-600">
                  <div className="text-xs font-mono">[ ]</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">Fields</div>
                  <div className="font-medium text-gray-800">{fieldsArray.join(", ")}</div>
                </div>
              </motion.div>
            )}
            
            {searchInfo?.rating && (
              <motion.div 
                className="flex gap-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center rounded-md bg-amber-100 p-1.5 text-amber-600">
                  <Star className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">Min Rating</div>
                  <div className="font-medium text-gray-800">{searchInfo.rating}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Results</h3>
          <div className="space-y-3">
            <div className="flex gap-2 text-sm">
              <div className="flex items-center justify-center rounded-md bg-blue-100 p-1.5 text-blue-600">
                <span className="text-xs font-bold">#</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Total Count</div>
                <div className="font-medium text-gray-800">{totalCount} results found</div>
              </div>
            </div>
            
            {completedAt && (
              <div className="flex gap-2 text-sm">
                <div className="flex items-center justify-center rounded-md bg-teal-100 p-1.5 text-teal-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">Completed At</div>
                  <div className="font-medium text-gray-800">
                    {format(new Date(completedAt), "MMM d, yyyy HH:mm")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
