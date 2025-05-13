
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
      className="bg-white border-b sticky top-0 z-10"
    >
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-slate-100 gap-1.5 pl-1 pr-3 h-8"
              asChild
            >
              <Link to="/dashboard/results">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="text-sm">Back</span>
              </Link>
            </Button>
            
            <Button 
              onClick={onRefresh}
              size="sm"
              variant="outline"
              className="gap-1.5 h-8"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="text-sm">Refresh</span>
            </Button>
          </div>
          
          {/* Title and status */}
          <div className="flex flex-col gap-3 pt-1 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mr-2">{title}</h1>
              <Badge className={`${getStatusColor(status)} ml-0.5 flex items-center gap-1 capitalize text-xs`}>
                {getStatusIcon(status)}
                <span>{status}</span>
              </Badge>
              
              {stage && stage !== status && (
                <Badge variant="outline" className="flex items-center gap-1 capitalize text-xs">
                  <span>{stage}</span>
                </Badge>
              )}
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span>Created {format(new Date(createdAt), "MMM d, yyyy")}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700 font-medium">Location:</span>
                  <span>{location}</span>
                </div>
              )}
              
              {fields && fields.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700 font-medium">Fields:</span>
                  <span>{fields.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Export actions */}
          {resultUrl && status === "completed" && (
            <div className="flex items-center gap-2 py-1">
              <Button 
                size="sm"
                className="gap-1.5 bg-violet-primary hover:bg-violet-light"
                onClick={() => window.open(resultUrl, '_blank')}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
