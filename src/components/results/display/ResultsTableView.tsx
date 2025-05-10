
import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Lock, MapPin, Star } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResultsTableViewProps {
  results: any[];
  areReviewsRestricted: boolean;
  sortConfig: {
    key: string | null,
    direction: 'ascending' | 'descending'
  };
  handleSort: (key: string) => void;
}

export default function ResultsTableView({ 
  results, 
  areReviewsRestricted, 
  sortConfig,
  handleSort
}: ResultsTableViewProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Business Name
                {sortConfig.key === 'name' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp size={14} /> : 
                    <ChevronDown size={14} />
                )}
              </div>
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort('rating')}
            >
              <div className="flex items-center gap-1">
                Rating
                {sortConfig.key === 'rating' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp size={14} /> : 
                    <ChevronDown size={14} />
                )}
              </div>
            </TableHead>
            {!areReviewsRestricted && (
              <TableHead 
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => handleSort('reviews')}
              >
                <div className="flex items-center gap-1">
                  Reviews
                  {sortConfig.key === 'reviews' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp size={14} /> : 
                      <ChevronDown size={14} />
                  )}
                </div>
              </TableHead>
            )}
            <TableHead>Phone</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center gap-1">
                Category
                {sortConfig.key === 'category' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp size={14} /> : 
                    <ChevronDown size={14} />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id} className="group hover:bg-slate-50">
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{result.address}</span>
              </TableCell>
              <TableCell>{result.city}</TableCell>
              <TableCell>{result.state}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" />
                  <span>{result.rating}</span>
                </div>
              </TableCell>
              {!areReviewsRestricted && (
                <TableCell>{result.reviews}</TableCell>
              )}
              <TableCell>{result.phone}</TableCell>
              <TableCell>{result.category}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
