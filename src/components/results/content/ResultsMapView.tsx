
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsMapViewProps {
  isLimited: boolean;
}

export default function ResultsMapView({ isLimited }: ResultsMapViewProps) {
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    navigate("/dashboard/billing");
  };
  
  return (
    <div className="bg-slate-50 p-8 border rounded-lg text-center">
      <MapPin className="h-16 w-16 mx-auto mb-4 text-slate-400" />
      <h3 className="text-lg font-medium mb-2">Map View</h3>
      <p className="text-slate-500 mb-4">
        See your data plotted on an interactive map.
      </p>
      {isLimited ? (
        <Button onClick={handleUpgradeClick}>Upgrade to Access Map View</Button>
      ) : (
        <p className="text-sm text-slate-400">
          This feature is coming soon!
        </p>
      )}
    </div>
  );
}
