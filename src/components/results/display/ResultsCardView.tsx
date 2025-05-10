
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MapPin, Star } from "lucide-react";

interface ResultsCardViewProps {
  results: any[];
  areReviewsRestricted: boolean;
}

export default function ResultsCardView({ results, areReviewsRestricted }: ResultsCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden group">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="truncate">{result.name}</span>
              <Badge variant="secondary" className="ml-2">{result.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{result.address}</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-3">
                <Star size={14} className="text-yellow-400 mr-1" />
                <span className="font-semibold">{result.rating}</span>
              </div>
              {!areReviewsRestricted && (
                <div className="text-sm text-slate-500">
                  ({result.reviews} reviews)
                </div>
              )}
            </div>
            <div className="text-sm">{result.city}, {result.state}</div>
            <div className="text-sm">{result.phone}</div>
          </CardContent>
          <div className="p-4 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <ExternalLink size={14} />
              <span>View Details</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
