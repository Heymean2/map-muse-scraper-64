
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function AdvancedFilters() {
  return (
    <div className="mt-8 bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Need more specific data? Use our advanced filters to refine your search results.
        </p>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          <span>Open Advanced Filters</span>
        </Button>
      </div>
      <div className="flex-1">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-soft">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Rating</span>
              <span className="font-medium">4+ stars</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Open Now</span>
              <span className="font-medium">Yes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Categories</span>
              <span className="font-medium">Coffee, Bakery</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Price Level</span>
              <span className="font-medium">$$-$$$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
