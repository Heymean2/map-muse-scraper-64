
import React from 'react';
import { AlertCircle, RefreshCw, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ResultsErrorStateProps {
  error: string;
}

export default function ResultsErrorState({ error }: ResultsErrorStateProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for the children
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-lg border shadow-sm overflow-hidden"
    >
      <div className="p-8 text-center flex flex-col items-center">
        <motion.div 
          variants={childVariants}
          className="relative"
        >
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
        </motion.div>
        
        <motion.h3 
          variants={childVariants}
          className="text-2xl font-medium text-gray-900 mb-3"
        >
          Error Loading Results
        </motion.h3>
        
        <motion.p 
          variants={childVariants}
          className="text-gray-600 mb-6 max-w-md"
        >
          {error}
        </motion.p>
        
        <motion.div 
          variants={childVariants}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button 
            onClick={handleRefresh} 
            className="gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </motion.div>
        
        <motion.div
          variants={childVariants}
          className="mt-8 pt-6 border-t border-gray-100 w-full max-w-md"
        >
          <div className="flex items-center justify-center text-sm text-gray-500">
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>Need help? Check our <a href="#" className="text-blue-600 hover:underline">troubleshooting guide</a></span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
