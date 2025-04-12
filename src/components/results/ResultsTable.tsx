
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsTableProps {
  data: any[];
  searchInfo?: {
    keywords?: string;
    location?: string;
    fields?: string;
    rating?: string;
    filters?: any;
  };
  totalCount: number;
  isLimited?: boolean;
}

export default function ResultsTable({ data, searchInfo, totalCount, isLimited = false }: ResultsTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Function to format column headers from snake_case to Title Case
  const formatColumnHeader = (header: string) => {
    return header
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium">Results for: {searchInfo?.keywords}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Found {totalCount} records
          </p>
        </div>
        
        {isLimited && (
          <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200">
            <Lock className="h-3 w-3" />
            <span>Limited Preview</span>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            {isLimited 
              ? "Showing limited preview data (5 rows). Upgrade to see all results."
              : "Data extracted from Google Maps based on your search criteria."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              {Object.keys(data[0] || {}).map((header) => (
                <TableHead key={header}>
                  {formatColumnHeader(header)}
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, index: number) => (
              <TableRow key={index} className="group">
                {Object.entries(item).map(([key, value]: [string, any], valueIndex: number) => (
                  <TableCell key={valueIndex} className={key === 'name' ? 'font-medium' : ''}>
                    {typeof value === 'string' && value.startsWith('http') ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Image
                      </a>
                    ) : (
                      String(value)
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(item.name || '')}`, '_blank')}
                  >
                    <ExternalLink size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {isLimited && data.length >= 5 && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200 text-center text-sm">
          <p className="text-yellow-700">
            Only showing 5 rows out of {totalCount}. Upgrade your plan to view all data.
          </p>
        </div>
      )}
    </div>
  );
}
