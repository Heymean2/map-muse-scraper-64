
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star, TrendingUp, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsStatsViewProps {
  areReviewsRestricted: boolean;
}

export default function ResultsStatsView({ areReviewsRestricted }: ResultsStatsViewProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">128</div>
            <p className="text-sm text-slate-500">Based on your search criteria</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">4.5</div>
            <div className="flex items-center text-sm text-slate-500">
              <Star size={14} className="text-yellow-400 mr-1" />
              Across all businesses
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">Café</div>
            <p className="text-sm text-slate-500">Most common business type</p>
          </CardContent>
        </Card>
      </div>
      
      {areReviewsRestricted && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Lock size={16} />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              Upgrade to Pro to access advanced analytics including review analysis, 
              popularity trends, and business performance insights.
            </p>
            <Button 
              className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => navigate('/dashboard/billing')}
            >
              <TrendingUp size={14} className="mr-1" />
              Unlock Advanced Analytics
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
