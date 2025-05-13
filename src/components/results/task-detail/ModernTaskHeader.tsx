
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, RefreshCw, Download, Share2, Clock, 
  ChevronDown, ChevronUp, Calendar, MapPin 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusIcon } from "./utils/statusUtils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModernTaskHeaderProps {
  title: string;
  status: string;
  stage?: string;
  createdAt?: string;
  location?: string;
  fields?: string[];
  resultUrl?: string;
  onRefresh: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ModernTaskHeader({
  title,
  status,
  stage,
  createdAt,
  location,
  fields,
  resultUrl,
  onRefresh,
  activeTab,
  setActiveTab
}: ModernTaskHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Add scroll event listener to detect when to collapse header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
        if (!isCollapsed) setIsCollapsed(true);
      } else if (window.scrollY <= 20 && isCollapsed) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCollapsed]);

  return (
    <motion.div 
      className={`bg-white sticky top-0 z-20 border-b border-slate-200 transition-all duration-200 ease-in-out ${
        hasScrolled ? "shadow-md" : ""
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col">
          {/* Top navigation bar - always visible */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-slate-100 gap-1.5 mr-4 text-slate-700"
                asChild
              >
                <Link to="/dashboard/results">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Results</span>
                </Link>
              </Button>
              
              <h1 className="text-xl font-semibold text-slate-800 line-clamp-1">
                {title}
              </h1>
              
              <Badge 
                className={`${getStatusColor(status)} ml-3 flex items-center gap-1 capitalize text-xs font-medium py-1 px-2`}
              >
                {getStatusIcon(status)}
                <span>{status}</span>
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={onRefresh}
                size="sm"
                variant="outline"
                className="gap-1.5 border-slate-200 shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </Button>
              
              {resultUrl && status === "completed" && (
                <Button 
                  size="sm"
                  className="gap-1.5 bg-violet-primary hover:bg-violet-light shadow-sm"
                  onClick={() => window.open(resultUrl, '_blank')}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Collapsible content */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col pb-4 space-y-3">
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 pt-1">
                    {createdAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>Created {format(new Date(createdAt), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    
                    {location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span>{location}</span>
                      </div>
                    )}
                    
                    {stage && stage !== status && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs capitalize">
                        <span>{stage}</span>
                      </Badge>
                    )}
                  </div>
                  
                  {/* Fields */}
                  {fields && fields.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-sm text-slate-500 font-medium">Fields:</span>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(fields) 
                          ? fields.map((field, index) => (
                              <Badge key={index} variant="secondary" className="text-xs font-normal">
                                {field}
                              </Badge>
                            ))
                          : typeof fields === 'string' && 
                              fields.split(',').map((field, index) => (
                                <Badge key={index} variant="secondary" className="text-xs font-normal">
                                  {field.trim()}
                                </Badge>
                              ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Tabs navigation */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
                    <TabsList>
                      <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                      <TabsTrigger value="data" className="text-sm">Data</TabsTrigger>
                      {status === "processing" && (
                        <TabsTrigger value="progress" className="text-sm">Progress</TabsTrigger>
                      )}
                    </TabsList>
                  </Tabs>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Toggle button */}
          <Button
            variant="ghost"
            size="sm"
            className="mx-auto -mb-1 h-6 px-2 text-slate-400 hover:bg-transparent hover:text-slate-600"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
