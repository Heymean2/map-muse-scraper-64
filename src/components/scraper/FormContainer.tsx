
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { withDelay, animationClasses } from "@/lib/animations";
import CategorySelector from "./CategorySelector";
import LocationSelector from "./LocationSelector";
import DataTypeSelector from "./DataTypeSelector";
import RatingSelector from "./RatingSelector";
import FormSubmissionHandler from "./FormSubmissionHandler";

export default function FormContainer() {
  // Form state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [useKeyword, setUseKeyword] = useState(false);
  
  // Location related states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  
  // Data type multi-selection state
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  
  // Rating state
  const [selectedRating, setSelectedRating] = useState<string>("");

  return (
    <Card className={`glass-card ${withDelay(animationClasses.fadeIn, 300)}`}>
      <CardContent className="pt-6">
        <FormSubmissionHandler
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          useKeyword={useKeyword}
          selectedCountry={selectedCountry}
          selectedStates={selectedStates}
          selectedDataTypes={selectedDataTypes}
          selectedRating={selectedRating}
        >
          <CategorySelector 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            useKeyword={useKeyword}
            setUseKeyword={setUseKeyword}
          />
          
          <LocationSelector 
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
          />
          
          <DataTypeSelector 
            selectedDataTypes={selectedDataTypes}
            setSelectedDataTypes={setSelectedDataTypes}
          />
          
          <RatingSelector
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />
        </FormSubmissionHandler>
      </CardContent>
    </Card>
  );
}
