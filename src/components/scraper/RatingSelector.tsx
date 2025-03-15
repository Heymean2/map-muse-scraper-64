
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

interface RatingSelectorProps {
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
}

export default function RatingSelector({
  selectedRating,
  setSelectedRating,
}: RatingSelectorProps) {
  // Rating options
  const ratingOptions = [
    { value: "4.5+", label: "4.5+" },
    { value: "4+", label: "4+" },
    { value: "3.5+", label: "3.5+" },
    { value: "3+", label: "3+" },
    { value: "2.5+", label: "2.5+" },
    { value: "2+", label: "2+" },
  ];

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
      >
        {ratingOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`rating-${option.value}`} />
            <Label htmlFor={`rating-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
