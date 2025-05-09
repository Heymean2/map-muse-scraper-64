
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, RefreshCw, Tag, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface TaskHeaderProps {
  title: string;
  status: string;
  createdAt?: string;
  location?: string;
  fields?: string[];
  resultUrl?: string;
  onRefresh: () => void;
}

export default function TaskHeader({
  title,
  status,
  createdAt,
  location,
  fields,
  resultUrl,
  onRefresh
}: TaskHeaderProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>;
      case 'processing':
        return <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-1.5"></span>;
      case 'failed':
        return <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-gray-500 mr-1.5"></span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 z-0"></div>
      
      <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <Button
              as={Link}
              to="/result"
              variant="ghost"
              size="sm"
              className="hover:bg-white/30 gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to results
            </Button>
            
            <Button 
              onClick={onRefresh}
              size="sm"
              className="gap-2 bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
              <Badge className={`${getStatusColor(status)} ml-2 flex items-center gap-1`}>
                {getStatusIcon(status)}
                <span className="capitalize">{status}</span>
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  <div>
                    <span>Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                    <span className="text-gray-400 ml-1">({format(new Date(createdAt), "MMM d, yyyy")})</span>
                  </div>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{location}</span>
                </div>
              )}
              
              {fields && fields.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{fields.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
          
          {resultUrl && (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => window.open(resultUrl, '_blank')}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
              
              <Button
                variant="outline"
                className="gap-2"
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
