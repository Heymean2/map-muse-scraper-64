
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getScraperRatings } from "@/services/scraper/formOptions";

interface RatingSelectorProps {
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
}

export default function RatingSelector({
  selectedRating,
  setSelectedRating,
}: RatingSelectorProps) {
  // Fetch rating options from Supabase
  const { data: ratingOptions = [], isLoading } = useQuery({
    queryKey: ['scraperRatings'],
    queryFn: getScraperRatings,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-400" />
        <Label htmlFor="rating-filter">Filter by Rating (Optional)</Label>
      </div>
      
      <RadioGroup
        value={selectedRating}
        onValueChange={setSelectedRating}
        className="grid grid-cols-3 gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="col-span-3 text-sm text-slate-500">Loading rating options...</div>
        ) : (
          ratingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`rating-${option.value}`} />
              <Label htmlFor={`rating-${option.value}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))
        )}
      </RadioGroup>
    </div>
  );
}
