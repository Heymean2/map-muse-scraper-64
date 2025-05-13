
import React from 'react';
import { Plus, Minus, MapPin, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut }: MapControlsProps) => {
  return (
    <motion.div 
      className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          onClick={onZoomIn} 
          className="p-2 hover:bg-slate-100 transition-colors flex items-center justify-center"
        >
          <Plus size={18} className="text-slate-700" />
        </button>
        <div className="h-px bg-slate-200" />
        <button 
          onClick={onZoomOut} 
          className="p-2 hover:bg-slate-100 transition-colors flex items-center justify-center"
        >
          <Minus size={18} className="text-slate-700" />
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <button className="p-2 hover:bg-slate-100 transition-colors flex items-center justify-center">
          <Layers size={18} className="text-slate-700" />
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <button className="p-2 hover:bg-slate-100 transition-colors flex items-center justify-center">
          <MapPin size={18} className="text-violet-primary" />
        </button>
      </div>
    </motion.div>
  );
};

export default MapControls;
