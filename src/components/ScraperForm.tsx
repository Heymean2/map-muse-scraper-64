
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withDelay, animationClasses } from "@/lib/animations";
import { toast } from "sonner";
import { startScraping } from "@/services/scraper";
import { useAuth } from "@/contexts/AuthContext";

// Import the component modules
import CategorySelector from "./scraper/CategorySelector";
import LocationSelector from "./scraper/LocationSelector";
import DataTypeSelector from "./scraper/DataTypeSelector";
import RatingSelector from "./scraper/RatingSelector";

export default function ScraperForm() {
  const navigate = useNavigate();
  const { user, session, refreshSession } = useAuth();
  
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
  
  // Error state
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !session) {
      toast.error("You must be logged in to use this feature");
      navigate("/auth", { 
        state: { 
          returnTo: "/dashboard/scrape" 
        }
      });
    }
  }, [user, session, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setFormError(null);
    
    // Double-check authentication
    if (!user) {
      toast.error("You must be logged in to use this feature");
      navigate("/auth");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Form validation
      if (!useKeyword && !selectedCategory) {
        setFormError("Please select a category or use a keyword");
        toast.error("Please select a category or use a keyword");
        setIsLoading(false);
        return;
      }
      
      if (!selectedCountry) {
        setFormError("Please select a country");
        toast.error("Please select a country");
        setIsLoading(false);
        return;
      }
      
      if (selectedStates.length === 0) {
        setFormError("Please select at least one state");
        toast.error("Please select at least one state");
        setIsLoading(false);
        return;
      }
      
      if (selectedDataTypes.length === 0) {
        setFormError("Please select at least one data type to extract");
        toast.error("Please select at least one data type to extract");
        setIsLoading(false);
        return;
      }
      
      // Ensure session is fresh
      try {
        await refreshSession();
      } catch (refreshError) {
        console.error("Failed to refresh session:", refreshError);
        // Continue anyway, the scraper service will handle this
      }
      
      // Prepare keywords
      const keywords = useKeyword ? searchQuery : selectedCategory;
      
      // Start scraping with loading toast
      const toastId = toast.loading("Starting scraping process...");
      
      const result = await startScraping({
        keywords,
        country: selectedCountry,
        states: selectedStates,
        fields: selectedDataTypes,
        rating: selectedRating || undefined
      });
      
      if (result.success) {
        toast.dismiss(toastId);
        toast.success("Scraping started successfully");
        // Redirect to results page with task ID
        navigate(`/result${result.task_id ? `?task_id=${result.task_id}` : ''}`);
      } else {
        toast.dismiss(toastId);
        toast.error(result.error || "Failed to start scraping");
        setFormError(result.error || "Failed to start scraping");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request");
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (!user && !session) {
    return (
      <Container className="max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
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
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {formError}
                </div>
              )}
              
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
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : "Start Scraping"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
