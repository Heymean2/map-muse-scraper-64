
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withDelay, animationClasses } from "@/lib/animations";
import { TabsContent } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { getUserPlanInfo } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";

// Import our new component files
import ResultsTableView from "./results/display/ResultsTableView";
import ResultsCardView from "./results/display/ResultsCardView";
import ResultsStatsView from "./results/display/ResultsStatsView";
import ResultsAdditionalInfo from "./results/display/ResultsAdditionalInfo";
import ResultsUpgradePrompt from "./results/display/ResultsUpgradePrompt";
import ResultsTabs from "./results/display/ResultsTabs";

// Mock data for display purposes
const mockResults = [
  {
    id: 1,
    name: "The Coffee House",
    address: "123 Main St, New York, NY",
    city: "New York",
    state: "NY",
    rating: 4.7,
    reviews: 324,
    phone: "(212) 555-1234",
    category: "Café",
  },
  {
    id: 2,
    name: "Downtown Diner",
    address: "456 Broadway, New York, NY",
    city: "New York",
    state: "NY",
    rating: 4.2,
    reviews: 188,
    phone: "(212) 555-5678",
    category: "Restaurant",
  },
  {
    id: 3,
    name: "Central Park Bakery",
    address: "789 5th Ave, New York, NY",
    city: "New York",
    state: "NY",
    rating: 4.8,
    reviews: 412,
    phone: "(212) 555-9012",
    category: "Bakery",
  },
  {
    id: 4,
    name: "Empire State Burgers",
    address: "101 Park Ave, New York, NY",
    city: "New York",
    state: "NY",
    rating: 4.5,
    reviews: 256,
    phone: "(212) 555-3456",
    category: "Fast Food",
  },
  {
    id: 5,
    name: "Brooklyn Pizza Co.",
    address: "202 Atlantic Ave, Brooklyn, NY",
    city: "Brooklyn",
    state: "NY",
    rating: 4.6,
    reviews: 380,
    phone: "(718) 555-7890",
    category: "Restaurant",
  },
];

export default function ResultsDisplay() {
  const [activeTab, setActiveTab] = useState("table");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null,
    direction: 'ascending' | 'descending'
  }>({
    key: null,
    direction: 'ascending'
  });

  // Get user's plan to check restrictions
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });

  // Check if reviews are restricted based on plan
  const areReviewsRestricted = !planInfo?.features?.reviews;

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedResults = [...mockResults].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const key = sortConfig.key as keyof typeof a;
    
    if (a[key] < b[key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <section className="py-12 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Data Extraction Results
          </h2>
          <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
            Here's a sample of the data you'll get from our Google Maps scraper.
          </p>
        </div>

        <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <ResultsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <TabsContent value="table" className={`${withDelay(animationClasses.scaleIn, 300)}`}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>Showing 5 of 128 results for "cafes in New York"</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ResultsTableView 
                  results={sortedResults} 
                  areReviewsRestricted={areReviewsRestricted}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                />
              </CardContent>
              
              <CardFooter className="border-t border-slate-100 flex justify-center p-4">
                <ResultsUpgradePrompt areReviewsRestricted={areReviewsRestricted} />
                {!areReviewsRestricted && <button className="btn btn-outline">Load More Results</button>}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className={`${withDelay(animationClasses.scaleIn, 300)}`}>
            <ResultsCardView results={sortedResults} areReviewsRestricted={areReviewsRestricted} />
            <ResultsUpgradePrompt areReviewsRestricted={areReviewsRestricted} />
          </TabsContent>
          
          <TabsContent value="stats" className={`${withDelay(animationClasses.scaleIn, 300)}`}>
            <ResultsStatsView areReviewsRestricted={areReviewsRestricted} />
          </TabsContent>
        </Tabs>
        
        <ResultsAdditionalInfo areReviewsRestricted={areReviewsRestricted} />
      </Container>
    </section>
  );
}
