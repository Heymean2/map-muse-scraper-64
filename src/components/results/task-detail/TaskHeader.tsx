
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Download, Share2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusIcon } from "./utils/statusUtils";

interface TaskHeaderProps {
  title: string;
  status: string;
  stage?: string;
  createdAt?: string;
  location?: string;
  fields?: string[];
  resultUrl?: string;
  onRefresh: () => void;
}

export default function TaskHeader({
  title,
  status,
  stage,
  createdAt,
  location,
  fields,
  resultUrl,
  onRefresh
}: TaskHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-white to-slate-50 border-b sticky top-0 z-10 py-6"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-5">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-slate-100 gap-2 text-slate-700 pl-2 pr-4"
              asChild
            >
              <Link to="/dashboard/results">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to results</span>
              </Link>
            </Button>
            
            <Button 
              onClick={onRefresh}
              size="sm"
              variant="outline"
              className="gap-2 border-slate-200 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
          </div>
          
          {/* Title and status */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>
              <Badge className={`${getStatusColor(status)} px-3 py-1 flex items-center gap-1 capitalize text-xs font-medium`}>
                {getStatusIcon(status)}
                <span>{status}</span>
              </Badge>
              
              {stage && stage !== status && (
                <Badge variant="outline" className="flex items-center gap-1 capitalize text-xs px-3 py-1 font-medium">
                  <span>{stage}</span>
                </Badge>
              )}
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 pt-1">
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Created {format(new Date(createdAt), "MMM d, yyyy")}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-800 font-medium">Location:</span>
                  <span>{location}</span>
                </div>
              )}
              
              {fields && fields.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-800 font-medium">Fields:</span>
                  <span>{fields.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Export actions */}
          {resultUrl && status === "completed" && (
            <div className="flex flex-wrap items-center gap-3 py-2 mt-2">
              <Button 
                size="default"
                className="gap-2 bg-violet-primary hover:bg-violet-light shadow-sm"
                onClick={() => window.open(resultUrl, '_blank')}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
              
              <Button
                size="default"
                variant="outline"
                className="gap-2 border-slate-200 shadow-sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
