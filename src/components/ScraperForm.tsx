
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withDelay, animationClasses } from "@/lib/animations";
import { toast } from "sonner";
import { startScraping } from "@/services/scraper";

// Import the new component modules
import CategorySelector from "./scraper/CategorySelector";
import LocationSelector from "./scraper/LocationSelector";
import DataTypeSelector from "./scraper/DataTypeSelector";
import RatingSelector from "./scraper/RatingSelector";

export default function ScraperForm() {
  const navigate = useNavigate();
  
  // Form state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [useKeyword, setUseKeyword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Location related states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  
  // Data type multi-selection state
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  
  // Rating state
  const [selectedRating, setSelectedRating] = useState<string>("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      if (!useKeyword && !selectedCategory) {
        toast.error("Please select a category or use a keyword");
        return;
      }
      
      if (!selectedCountry) {
        toast.error("Please select a country");
        return;
      }
      
      if (selectedStates.length === 0) {
        toast.error("Please select at least one state");
        return;
      }
      
      if (selectedDataTypes.length === 0) {
        toast.error("Please select at least one data type to extract");
        return;
      }
      
      // Prepare keywords
      const keywords = useKeyword ? searchQuery : selectedCategory;
      
      // Start scraping
      const result = await startScraping({
        keywords,
        country: selectedCountry,
        states: selectedStates,
        fields: selectedDataTypes,
        rating: selectedRating || undefined
      });
      
      if (result.success) {
        toast.success("Scraping started successfully");
        // Redirect to results page with task ID
        navigate(`/get${result.task_id ? `?task_id=${result.task_id}` : ''}`);
      } else {
        toast.error(result.error || "Failed to start scraping");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="how-it-works" className="py-24">
      <Container className="max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Start Scraping in Minutes
          </h2>
          <p className={`text-lg text-slate-600 dark:text-slate-400 ${withDelay(animationClasses.slideUp, 200)}`}>
            Our intuitive interface makes it easy to extract the data you need from Google Maps.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <Card className={`glass-card ${withDelay(animationClasses.fadeIn, 300)}`}>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Start Scraping"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
