
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { withDelay, animationClasses } from "@/lib/animations";

// Import the new component modules
import CategorySelector from "./scraper/CategorySelector";
import LocationSelector from "./scraper/LocationSelector";
import DataTypeSelector from "./scraper/DataTypeSelector";
import PreviewTabs from "./scraper/PreviewTabs";
import AdvancedFilters from "./scraper/AdvancedFilters";

export default function ScraperForm() {
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would normally handle the response
    }, 2000);
  };

  return (
    <section id="how-it-works" className="py-24">
      <Container className="max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Start Scraping in Minutes
          </h2>
          <p className={`text-lg text-slate-600 dark:text-slate-400 ${withDelay(animationClasses.slideUp, 200)}`}>
            Our intuitive interface makes it easy to extract the data you need from Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card className={`glass-card ${withDelay(animationClasses.fadeIn, 300)}`}>
                <CardHeader>
                  <CardTitle>Extract Map Data</CardTitle>
                  <CardDescription>
                    Fill in the form to start extracting valuable data from Google Maps.
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Start Scraping"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className={withDelay(animationClasses.fadeIn, 400)}>
              <PreviewTabs />
              <AdvancedFilters />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
