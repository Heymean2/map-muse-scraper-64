
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CSVPreviewTableProps {
  csvData: string[][];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  isLimited: boolean;
}

export default function CSVPreviewTable({ 
  csvData, 
  currentPage,
  setCurrentPage,
  rowsPerPage,
  isLimited
}: CSVPreviewTableProps) {
  // Calculate pagination values
  const totalRows = isLimited ? Math.min(5, csvData.length - 1) : (csvData.length - 1);
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1; // +1 to skip header
  const endIndex = Math.min(startIndex + rowsPerPage, csvData.length);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              {csvData[0]?.map((header, i) => (
                <th key={i} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-medium text-slate-700 dark:text-slate-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.slice(startIndex, endIndex).map((row, rowIndex) => (
              <tr 
                key={rowIndex + startIndex} 
                className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/10'
                }`}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && !isLimited && (
        <div className="flex items-center justify-between p-4 bg-slate-50 border-t">
          <div className="text-sm text-slate-600">
            Showing rows {startIndex} to {endIndex - 1} of {csvData.length - 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {isLimited && (
        <div className="flex justify-center py-3 bg-slate-50 border-t">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Limited preview ({csvData.length - 1} rows shown)
          </Badge>
        </div>
      )}
    </>
  );
}
