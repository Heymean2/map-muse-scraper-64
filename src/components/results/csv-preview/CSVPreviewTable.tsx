
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-slate-100">
            <tr>
              {csvData[0]?.map((header, i) => (
                <th key={i} className="border border-gray-200 px-3 py-2 text-left text-sm font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.slice(startIndex, endIndex).map((row, rowIndex) => (
              <tr key={rowIndex + startIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-200 px-3 py-2 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && !isLimited && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing rows {startIndex} to {endIndex - 1} of {csvData.length - 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {isLimited && (
        <div className="flex justify-center mt-4">
          <p className="text-sm text-gray-500">
            {csvData.length - 1} rows shown (limited preview)
          </p>
        </div>
      )}
    </>
  );
}
