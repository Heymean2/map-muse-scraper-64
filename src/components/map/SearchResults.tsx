
import React from 'react';
import { Search, X } from 'lucide-react';

const SearchResults = () => {
  return (
    <>
      {/* Search bar simulation */}
      <div className="h-12 w-full bg-white rounded-lg mb-6 flex items-center px-4 shadow-sm border border-slate-200">
        <div className="mr-3 text-slate-400">
          <Search size={18} />
        </div>
        <div className="flex-grow font-medium text-slate-700 text-sm">
          restaurants in California, USA
        </div>
        <div className="ml-2 text-slate-400">
          <X size={18} />
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-6 h-[calc(100%-4rem)]">
        {/* Results panel */}
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm border border-slate-100 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-medium text-slate-800">Results</div>
            <div className="text-sm text-blue-600">Share</div>
          </div>
          
          {/* Result items */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium text-slate-800">
                    {["The Elderberry House", "Californios", "Aroma Tavern"][i]}
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-amber-500 mr-1">4.7</span>
                    <span className="text-amber-500">★★★★</span>
                    <span className="text-amber-300">☆</span>
                    <span className="text-slate-500 ml-1">({[332, 482, 92][i]})</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span className="text-slate-500">$$$</span>
                  </div>
                  <div className="text-sm text-slate-500">Fine Dining</div>
                  <div className="text-sm text-slate-500">
                    <span className="text-red-500">Closed</span> • Opens 5 pm
                  </div>
                </div>
                <div className="w-16 h-16 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* GoogleMap component will be inserted in the parent */}
      </div>
    </>
  );
};

export default SearchResults;
