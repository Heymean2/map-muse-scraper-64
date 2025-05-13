
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MapDisplay = () => {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-slate-200/20">
        <AspectRatio ratio={16/9}>
          <div className="absolute inset-0 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">Map visualization placeholder</p>
            </div>
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default MapDisplay;
