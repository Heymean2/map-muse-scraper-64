
import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchResults = () => {
  return (
    <>
      {/* Search bar simulation */}
      <motion.div 
        className="h-12 w-full bg-white rounded-lg mb-6 flex items-center px-4 shadow-sm border border-slate-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mr-3 text-slate-400">
          <Search size={18} />
        </div>
        <motion.div 
          className="flex-grow font-medium text-slate-700 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          restaurants in California, USA
        </motion.div>
        <div className="ml-2 text-slate-400">
          <X size={18} />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-5 gap-6 h-[calc(100%-4rem)]">
        {/* Results panel */}
        <motion.div 
          className="col-span-2 bg-white rounded-lg p-4 shadow-sm border border-slate-100 overflow-y-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-medium text-slate-800">Results</div>
            <div className="text-sm text-blue-600">Share</div>
          </div>
          
          {/* Result items with staggered animation */}
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i} 
              className="mb-4 pb-4 border-b border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.2), duration: 0.5 }}
            >
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
                    <motion.span 
                      className="text-red-500"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Closed
                    </motion.span>
                    <span> • Opens 5 pm</span>
                  </div>
                </div>
                <motion.div 
                  className="w-16 h-16 bg-slate-200 rounded overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-200"
                    animate={{ 
                      background: ['linear-gradient(135deg, #e6e6e6 0%, #d9d9d9 100%)', 
                                 'linear-gradient(135deg, #d9d9d9 0%, #e6e6e6 100%)'] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          {/* Loading indicator */}
          <motion.div 
            className="py-3 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 text-sm text-violet-primary">
              <motion.div
                className="w-4 h-4 border-2 border-violet-primary/30 border-t-violet-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <span>Loading more results...</span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* GoogleMap component will be inserted in the parent */}
      </div>
    </>
  );
};

export default SearchResults;
