
import { format } from 'date-fns';
import { CalendarDays, Search, MapPin, Tag, Star, List, FileText } from 'lucide-react';

interface SearchInfoProps {
  totalCount: number;
  searchInfo?: {
    keywords?: string;
    location?: string;
    fields?: string;
    rating?: string;
    filters?: any;
  };
  completedAt?: string;
}

export default function SearchInfoCard({ totalCount, searchInfo, completedAt }: SearchInfoProps) {
  if (!searchInfo) {
    return null;
  }

  // Parse fields if it's a string
  const fieldsArray = searchInfo.fields 
    ? (typeof searchInfo.fields === 'string' ? searchInfo.fields.split(',') : searchInfo.fields) 
    : [];
    
  // Parse location if it contains country and states
  let country = '';
  let states = '';
  
  if (searchInfo.location) {
    const locationParts = searchInfo.location.split(' - ');
    if (locationParts.length > 1) {
      country = locationParts[0];
      states = locationParts[1];
    } else {
      country = searchInfo.location;
    }
  }

  return (
    <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
      <h3 className="font-medium mb-3">Search Details</h3>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <p><span className="font-medium">Keywords:</span> {searchInfo.keywords || 'N/A'}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <p><span className="font-medium">Country:</span> {country || 'N/A'}</p>
        </div>
        
        {states && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <p><span className="font-medium">States/Regions:</span> {states}</p>
          </div>
        )}
        
        {searchInfo.rating && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-400" />
            <p><span className="font-medium">Minimum Rating:</span> {searchInfo.rating}</p>
          </div>
        )}
        
        {fieldsArray.length > 0 && (
          <div className="flex items-start gap-2">
            <List className="h-4 w-4 text-slate-400 mt-1" />
            <div>
              <p className="font-medium">Extracted Fields:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {fieldsArray.map((field, index) => (
                  <span key={index} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-xs">
                    {field.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {completedAt && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <p><span className="font-medium">Completed:</span> {format(new Date(completedAt), 'MMM d, yyyy HH:mm:ss')}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
          <p className="font-medium">Total Records: {totalCount}</p>
        </div>
      </div>
    </div>
  );
}
