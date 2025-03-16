
import { format } from 'date-fns';
import { CalendarDays, Search, MapPin } from 'lucide-react';

interface SearchInfoProps {
  totalCount: number;
  searchInfo?: {
    keywords?: string;
    location?: string;
    filters?: any;
  };
  completedAt?: string;
}

export default function SearchInfoCard({ totalCount, searchInfo, completedAt }: SearchInfoProps) {
  if (!searchInfo) {
    return null;
  }

  return (
    <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
      <h3 className="font-medium mb-2">Search Details</h3>
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <p>Keywords: {searchInfo.keywords || 'N/A'}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <p>Location: {searchInfo.location || 'N/A'}</p>
        </div>
        
        {completedAt && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <p>Completed: {format(new Date(completedAt), 'MMM d, yyyy HH:mm:ss')}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
          <p className="font-medium">Total Records: {totalCount}</p>
        </div>
      </div>
    </div>
  );
}
