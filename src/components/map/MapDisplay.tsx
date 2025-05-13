
import React from 'react';
import GoogleMap from './GoogleMap';
import SearchResults from './SearchResults';

const MapDisplay = () => {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200 transition-all duration-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-white/80 backdrop-blur-sm p-6 rounded-xl overflow-hidden">
            <SearchResults />
            <div className="grid grid-cols-5 gap-6 h-[calc(100%-4rem)]">
              <div className="col-span-2">
                {/* This empty div maintains the grid structure */}
              </div>
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-accent/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <div className="text-sm font-medium text-accent">Beautiful and intuitive interface for scraping data</div>
      </div>
    </div>
  );
};

export default MapDisplay;
