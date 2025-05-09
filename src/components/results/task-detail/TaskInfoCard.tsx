
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

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
  
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-lg font-medium">Task Information</CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Status</span>
            <span className={`text-sm font-medium ${
              taskStatus === 'completed' ? 'text-green-600' : 
              taskStatus === 'processing' ? 'text-blue-600' : 
              taskStatus === 'failed' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {taskStatus.charAt(0).toUpperCase() + taskStatus.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">Search Query</h3>
          
          {searchInfo?.keywords && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Keywords</span>
              <span className="text-sm font-medium">{searchInfo.keywords}</span>
            </div>
          )}
          
          {searchInfo?.location && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Location</span>
              <span className="text-sm font-medium">{searchInfo.location}</span>
            </div>
          )}
          
          {fieldsArray.length > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Fields</span>
              <span className="text-sm font-medium">{fieldsArray.join(", ")}</span>
            </div>
          )}
          
          {searchInfo?.rating && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Min Rating</span>
              <span className="text-sm font-medium">{searchInfo.rating}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2 pt-2 border-t">
          <h3 className="text-sm font-medium text-slate-700">Results</h3>
          
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Total Count</span>
            <span className="text-sm font-medium">{totalCount} results</span>
          </div>
          
          {completedAt && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Completed At</span>
              <span className="text-sm font-medium">
                {new Date(completedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
