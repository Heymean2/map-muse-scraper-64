
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lock } from "lucide-react";

interface ResultsTableProps {
  data: any[];
  searchInfo?: {
    keywords?: string;
    location?: string;
    filters?: any;
  };
  totalCount: number;
  isLimited?: boolean;
}

export default function ResultsTable({ data, searchInfo, totalCount, isLimited = false }: ResultsTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

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
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, index: number) => (
              <TableRow key={index}>
                {Object.values(item).map((value: any, valueIndex: number) => (
                  <TableCell key={valueIndex}>
                    {typeof value === 'string' && value.startsWith('http') ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Image
                      </a>
                    ) : (
                      String(value)
                    )}
                  </TableCell>
                ))}
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
