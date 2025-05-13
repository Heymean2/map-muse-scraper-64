
import React from 'react';
import { motion } from 'framer-motion';

const MapAttribution = () => {
  return (
    <motion.div 
      className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      Map data ©2025 Google
    </motion.div>
  );
};

export default MapAttribution;
