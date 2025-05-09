
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Clock, Search, Database, FileText } from 'lucide-react';

export default function ResultsLoadingState() {
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const // Fix typing issue by using "as const"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 rounded-lg border p-6 shadow-sm bg-white"
    >
      {/* Header with status indicator */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <div className="flex items-center gap-2">
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="h-2 w-2 rounded-full bg-blue-500"
            />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center"
          >
            <Clock className="h-5 w-5 text-blue-500" />
          </motion.div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
      
      {/* Search section with animated icon */}
      <div className="relative">
        <div className="absolute left-3 top-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Search className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
        <Skeleton className="h-12 w-full max-w-md pl-10 mb-8 rounded-md" />
      </div>
      
      {/* Content section with staggered loading */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center"
          >
            <Database className="h-5 w-5 text-purple-500" />
          </motion.div>
          <div>
            <motion.div
              initial={{ width: "20%" }}
              animate={{ width: "60%" }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse" as const, // Fix typing issue
                ease: "easeInOut"
              }}
            >
              <Skeleton className="h-4 rounded-md" />
            </motion.div>
          </div>
        </div>
        
        <Skeleton className="h-64 w-full rounded-md relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </Skeleton>
        
        {/* Metrics cards with staggered appearance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
            >
              <Skeleton className="h-24 w-full rounded-md relative overflow-hidden">
                <div className="absolute top-4 left-4">
                  <motion.div 
                    animate={{ 
                      rotate: i === 0 ? 360 : 0,
                      scale: i === 1 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i === 0 ? 'bg-blue-50' : i === 1 ? 'bg-green-50' : 'bg-amber-50'
                    }`}
                  >
                    <FileText className={`h-4 w-4 ${
                      i === 0 ? 'text-blue-500' : i === 1 ? 'text-green-500' : 'text-amber-500'
                    }`} />
                  </motion.div>
                </div>
              </Skeleton>
            </motion.div>
          ))}
        </div>
        
        {/* Filter chips with pulse effect */}
        <div className="flex flex-wrap gap-2">
          {[24, 20, 28, 22].map((width, i) => (
            <motion.div
              key={i}
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.2 }}
            >
              <Skeleton className={`h-8 w-${width} rounded-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
