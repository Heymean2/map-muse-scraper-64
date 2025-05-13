
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Terminal, Database, Code, Network } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MapDisplay = () => {
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scannedPoints, setScannedPoints] = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [scrapedData, setScrapedData] = useState<string[]>([]);
  
  // Grid configuration
  const gridSize = { rows: 8, cols: 12 };
  
  // Sample data points to be "scraped"
  const dataPoints = [
    { x: 2, y: 3, label: "Coffee Shop", data: "rating: 4.7, reviews: 328" },
    { x: 5, y: 1, label: "Restaurant", data: "rating: 4.2, reviews: 156" },
    { x: 8, y: 6, label: "Hotel", data: "rating: 4.5, reviews: 210" },
    { x: 3, y: 7, label: "Gym", data: "rating: 4.0, reviews: 89" },
    { x: 10, y: 4, label: "Market", data: "rating: 4.3, reviews: 124" }
  ];
  
  // Create scanning animation
  useEffect(() => {
    // Simulate scanning process
    const scanInterval = setInterval(() => {
      setScrapingProgress(prev => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          return 100;
        }
        return newProgress;
      });
      
      // Randomly activate grid cells during scanning
      if (scrapingProgress < 80) {
        const randomRow = Math.floor(Math.random() * gridSize.rows);
        const randomCol = Math.floor(Math.random() * gridSize.cols);
        setActiveCell([randomRow, randomCol]);
        
        // Check if we're on a data point and should "collect" it
        const pointIndex = dataPoints.findIndex(p => 
          Math.abs(p.x - randomCol) < 2 && Math.abs(p.y - randomRow) < 2
        );
        
        if (pointIndex !== -1 && !scannedPoints.includes(pointIndex)) {
          setScannedPoints(prev => [...prev, pointIndex]);
          setTimeout(() => {
            setScrapedData(prev => [...prev, dataPoints[pointIndex].data]);
          }, 300);
        }
      } else {
        setActiveCell(null);
      }
    }, 200);
    
    return () => clearInterval(scanInterval);
  }, [scrapingProgress, scannedPoints]);
  
  // Generate the grid cells
  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const isActive = activeCell && activeCell[0] === row && activeCell[1] === col;
        const dataPoint = dataPoints.find(p => p.x === col && p.y === row);
        const isScanned = dataPoint && scannedPoints.includes(
          dataPoints.findIndex(p => p.x === col && p.y === row)
        );
        
        cells.push(
          <div 
            key={`${row}-${col}`}
            className={`border border-slate-200/30 relative ${isActive ? 'bg-accent/20' : ''}`}
          >
            {dataPoint && (
              <motion.div 
                className={`absolute inset-0 flex items-center justify-center ${isScanned ? 'text-accent' : 'text-slate-400'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-accent/20 absolute"
                  animate={{ 
                    scale: isScanned ? [1, 1.8, 1] : 1,
                    opacity: isScanned ? [0.7, 0.9, 0.5] : 0.5
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] font-mono relative z-10">{dataPoint.label}</span>
              </motion.div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  // Data paths connecting scraped points to the "database"
  const renderDataPaths = () => {
    return scannedPoints.map((pointIndex, i) => {
      const point = dataPoints[pointIndex];
      const startX = (point.x / gridSize.cols) * 100;
      const startY = (point.y / gridSize.rows) * 100;
      
      return (
        <motion.div 
          key={`path-${pointIndex}`}
          className="absolute pointer-events-none"
          style={{
            left: `${startX}%`,
            top: `${startY}%`,
            width: '1px',
            height: '1px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
        >
          {/* Data flow path */}
          <motion.div
            className="absolute h-px bg-gradient-to-r from-accent/70 via-accent to-primary/50"
            style={{
              width: `${100 - startX}px`,
              transformOrigin: 'left',
              transform: `rotate(${45 + (i * 10)}deg)`
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              delay: i * 0.2,
              duration: 0.8, 
              ease: "easeOut" 
            }}
          />
          
          {/* Data packet animation */}
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-accent"
            style={{
              transformOrigin: 'left',
              transform: `rotate(${45 + (i * 10)}deg)`
            }}
            initial={{ x: 0 }}
            animate={{ x: 100 - startX }}
            transition={{ 
              delay: i * 0.2 + 0.1,
              duration: 0.7,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </motion.div>
      );
    });
  };
  
  return (
    <div className="relative mx-auto max-w-5xl">
      <motion.div 
        className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-slate-200/20 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AspectRatio ratio={16/9}>
          <div className="absolute inset-0 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
            {/* Wireframe grid */}
            <div className="relative w-full h-full p-4 pb-16">
              {/* Background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
              </div>
              
              {/* Main grid */}
              <div 
                className="w-full h-full grid border border-slate-300/20"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
                }}
              >
                {renderGrid()}
              </div>
              
              {/* Scanner indicator */}
              {scrapingProgress < 100 && (
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-accent/20 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-transparent via-accent to-transparent"
                    style={{ width: '30%' }}
                    initial={{ x: -100 }}
                    animate={{ x: 400 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.5,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              )}
              
              {/* Data connector paths */}
              {renderDataPaths()}
              
              {/* Database visualization */}
              <motion.div 
                className="absolute right-4 bottom-4 bg-slate-800/80 shadow-lg border border-accent/30 rounded-md p-2 text-xs font-mono text-accent w-48"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-1 text-slate-200">
                  <Database size={14} className="text-accent" />
                  <span className="text-[10px] uppercase tracking-wider">Data Collection</span>
                </div>
                
                {/* Scraped data visualization */}
                <div className="h-32 overflow-y-auto bg-slate-900/70 rounded-sm p-1 text-[10px]">
                  {scrapedData.length > 0 ? (
                    scrapedData.map((data, i) => (
                      <motion.div 
                        key={i} 
                        className="mb-1 flex items-start gap-1"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Code size={10} className="mt-0.5 min-w-[10px]" />
                        <span className="text-slate-300">{data}</span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic p-1">
                      Awaiting data...
                    </div>
                  )}
                </div>
                
                {/* Progress indicator */}
                <div className="mt-2">
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Scraping Progress:</span>
                    <span>{Math.floor(scrapingProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${scrapingProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Terminal output */}
              <motion.div 
                className="absolute left-4 bottom-4 bg-slate-800/80 shadow-lg border border-slate-700/50 rounded-md p-2 text-xs font-mono text-green-400 w-48"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-1 text-slate-200">
                  <Terminal size={14} className="text-green-400" />
                  <span className="text-[10px] uppercase tracking-wider">Process Log</span>
                </div>
                
                <div className="h-16 overflow-y-auto bg-slate-900/70 rounded-sm p-1">
                  <motion.div 
                    className="text-[9px] font-mono"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div>Initializing scraper...</div>
                    {scrapingProgress > 10 && <div>> Loading targets...</div>}
                    {scrapingProgress > 25 && <div>> Scanning locations...</div>}
                    {scrapingProgress > 40 && <div>> Processing data points...</div>}
                    {scrapingProgress > 60 && <div>> Extracting information...</div>}
                    {scrapingProgress > 80 && <div>> Compiling results...</div>}
                    {scrapingProgress >= 100 && <div>> Scraping complete.</div>}
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Network indicator */}
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 top-2 flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded px-2 py-0.5 text-[10px] font-mono text-slate-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Network size={12} className="text-accent" />
                <div className="flex items-center gap-1">
                  <div>Status:</div>
                  <div className="text-green-400 flex items-center gap-1">
                    Active
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Scanning effect overlay */}
              {scrapingProgress < 90 && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"
                  style={{ 
                    backgroundSize: '100% 10px',
                    backgroundImage: 'linear-gradient(to bottom, rgba(125,211,252,0.05) 1px, transparent 1px)'
                  }}
                  animate={{ 
                    backgroundPosition: ['0 0', '0 -100px'] 
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 3,
                    ease: 'linear'
                  }}
                />
              )}
            </div>
          </div>
        </AspectRatio>
      </motion.div>
      
      {/* Bottom label */}
      <motion.div 
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-accent/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-sm font-medium text-accent">Data scraping visualization in real-time</div>
      </motion.div>
    </div>
  );
};

export default MapDisplay;
