
import React from 'react';
import { Plus, Minus } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <div 
        className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-50"
        onClick={onZoomIn}
      >
        <Plus size={18} />
      </div>
      <div 
        className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-50"
        onClick={onZoomOut}
      >
        <Minus size={18} />
      </div>
    </div>
  );
};

export default MapControls;
