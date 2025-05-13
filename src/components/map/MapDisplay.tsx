
import React from 'react';
import GoogleMap from './GoogleMap';
import SearchResults from './SearchResults';
import { motion } from 'framer-motion';

const MapDisplay = () => {
  return (
    <div className="relative mx-auto max-w-5xl">
      <motion.div 
        className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-full h-full bg-white/80 backdrop-blur-sm p-6 rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SearchResults />
            <div className="grid grid-cols-5 gap-6 h-[calc(100%-4rem)]">
              <div className="col-span-2">
                {/* This empty div maintains the grid structure */}
              </div>
              <GoogleMap />
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div 
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-accent/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-sm font-medium text-accent">Beautiful and intuitive interface for scraping data</div>
      </motion.div>
    </div>
  );
};

export default MapDisplay;
