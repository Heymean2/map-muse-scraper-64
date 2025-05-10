
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsAdditionalInfoProps {
  areReviewsRestricted: boolean;
}

export default function ResultsAdditionalInfo({ areReviewsRestricted }: ResultsAdditionalInfoProps) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
      <h3 className="text-xl font-semibold mb-4">Get More from Your Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-lg mr-4">
            <Download className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Export Options</h4>
            <p className="text-sm text-slate-600">
              Export your data in multiple formats including CSV, Excel, and JSON.
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-purple-100 p-2 rounded-lg mr-4">
            <Filter className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Advanced Filtering</h4>
            <p className="text-sm text-slate-600">
              Filter your results by category, rating, location and more.
            </p>
          </div>
        </div>
      </div>
      
      {areReviewsRestricted && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Ready to unlock all features?</h4>
              <p className="text-sm text-slate-600">Upgrade to Pro for just $49.99/month</p>
            </div>
            <Button 
              className="gap-1"
              onClick={() => navigate('/dashboard/billing')}
            >
              <span>Go to Billing</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
