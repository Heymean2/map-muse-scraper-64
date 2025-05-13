
import React from 'react';
import GoogleMap from './GoogleMap';
import SearchResults from './SearchResults';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Map } from 'lucide-react';

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
                {/* Data visualization animation elements */}
                <motion.div 
                  className="absolute top-20 left-10 z-10 opacity-40 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-md">
                    <Database size={16} className="text-primary" />
                    <span className="text-xs font-mono text-primary">Fetching location data...</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-20 left-8 z-10 opacity-40 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.7, 0] }}
                  transition={{ duration: 4, delay: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <div className="flex items-center gap-2 bg-accent/10 p-2 rounded-md">
                    <Code size={16} className="text-accent" />
                    <span className="text-xs font-mono text-accent">API response received</span>
                  </div>
                </motion.div>

                {/* Animated data paths */}
                <motion.div 
                  className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-primary/80 z-10 pointer-events-none"
                  animate={{ 
                    x: [0, 100, 200], 
                    y: [0, -50, -20],
                    scale: [1, 1.5, 0],
                    opacity: [0.7, 1, 0] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                />
                
                <motion.div 
                  className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-accent/80 z-10 pointer-events-none"
                  animate={{ 
                    x: [0, 80, 160], 
                    y: [0, -30, -60],
                    scale: [1, 1.5, 0],
                    opacity: [0.7, 1, 0] 
                  }}
                  transition={{ duration: 3.5, delay: 1, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
              
              {/* Map flow data visualization */}
              <div className="absolute right-1/4 top-20 z-10 opacity-40 pointer-events-none">
                <motion.div
                  className="flex items-center gap-2 bg-primary/5 p-2 rounded-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 0.7, 0], y: [10, 0, -10] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                >
                  <Globe size={16} className="text-primary" />
                  <span className="text-xs font-mono text-primary">Processing geolocation data</span>
                </motion.div>
              </div>
              
              <motion.div 
                className="absolute bottom-24 right-1/3 z-10 opacity-40 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2.5, delay: 3, repeat: Infinity, repeatDelay: 3 }}
              >
                <div className="flex items-center gap-2 bg-secondary/10 p-2 rounded-md">
                  <Map size={16} className="text-secondary" />
                  <span className="text-xs font-mono text-secondary">Geocoding complete</span>
                </div>
              </motion.div>
              
              {/* Connector paths */}
              <motion.div 
                className="absolute h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 w-40 z-10 pointer-events-none"
                style={{ top: '25%', left: '40%', transform: 'rotate(-15deg)' }}
                animate={{ opacity: [0, 0.7, 0], scaleX: [0, 1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              
              <motion.div 
                className="absolute h-px bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 w-60 z-10 pointer-events-none"
                style={{ bottom: '30%', left: '35%', transform: 'rotate(20deg)' }}
                animate={{ opacity: [0, 0.7, 0], scaleX: [0, 1, 1] }}
                transition={{ duration: 2.5, delay: 1, repeat: Infinity, repeatDelay: 4 }}
              />

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
