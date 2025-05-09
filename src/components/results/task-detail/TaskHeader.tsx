
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, RefreshCw } from "lucide-react";
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
    <div className="bg-slate-50 border-b py-6">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/30 gap-1"
              asChild
            >
              <Link to="/result">
                <ArrowLeft className="h-4 w-4" />
                Back to results
              </Link>
            </Button>
            
            <Button 
              onClick={onRefresh}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
              <Badge className={`${getStatusColor(status)} ml-2 flex items-center gap-1 capitalize`}>
                {getStatusIcon(status)}
                {status}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700">Created:</span>
                  <span>{createdAt && format(new Date(createdAt), "MMM d, yyyy")}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700">Location:</span>
                  <span>{location}</span>
                </div>
              )}
            </div>
            
            {fields && fields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 text-sm">
                <span className="text-slate-700">Fields:</span>
                <span className="text-slate-600">{fields.join(", ")}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {resultUrl && (
              <>
                <Button 
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
