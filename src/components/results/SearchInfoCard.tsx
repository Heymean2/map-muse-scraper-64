
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, MapPin, Star, Calendar, List, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SearchInfoCardProps {
  totalCount: number;
  searchInfo: {
    keywords?: string;
    location?: string;
    fields?: string;
    rating?: string;
    filters?: any;
  };
  completedAt?: string;
}

export default function SearchInfoCard({
  totalCount,
  searchInfo,
  completedAt
}: SearchInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Search Information
        </h3>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {searchInfo.keywords && (
            <div className="flex items-start gap-2">
              <dt className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 min-w-24">
                <Tag className="h-3.5 w-3.5 mr-1 text-primary" />
                Keywords:
              </dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {searchInfo.keywords}
              </dd>
            </div>
          )}
          
          {searchInfo.location && (
            <div className="flex items-start gap-2">
              <dt className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 min-w-24">
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                Location:
              </dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400">
                {searchInfo.location}
              </dd>
            </div>
          )}
          
          {searchInfo.fields && (
            <div className="flex items-start gap-2">
              <dt className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 min-w-24">
                <List className="h-3.5 w-3.5 mr-1 text-primary" />
                Fields:
              </dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400">
                {searchInfo.fields}
              </dd>
            </div>
          )}
          
          {searchInfo.rating && (
            <div className="flex items-start gap-2">
              <dt className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 min-w-24">
                <Star className="h-3.5 w-3.5 mr-1 text-primary" />
                Min Rating:
              </dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400">
                {searchInfo.rating}
              </dd>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <dt className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 min-w-24">
              <Calendar className="h-3.5 w-3.5 mr-1 text-primary" />
              Completed:
            </dt>
            <dd className="text-sm text-slate-600 dark:text-slate-400">
              {completedAt ? format(new Date(completedAt), 'MMM d, yyyy HH:mm') : 'N/A'}
            </dd>
          </div>
          
          <div className="flex items-start gap-2">
            <dt className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 min-w-24">
              Results:
            </dt>
            <dd className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {totalCount} entries found
            </dd>
          </div>
        </dl>
        
        {searchInfo.filters && Object.keys(searchInfo.filters).length > 0 && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="filters" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium">Advanced Filters</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(searchInfo.filters).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <dt className="font-medium text-slate-700 dark:text-slate-300">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
