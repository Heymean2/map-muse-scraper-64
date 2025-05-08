import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Filter, 
  Star, 
  ExternalLink, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Lock,
  TrendingUp,
  Trophy,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserPlanInfo } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";

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
  const navigate = useNavigate();
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
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter size={14} />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>

          <TabsContent value="table" className={`${withDelay(animationClasses.scaleIn, 300)}`}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>Showing 5 of 128 results for "cafes in New York"</CardDescription>
                  </div>
                  
                  {areReviewsRestricted && (
                    <Badge variant="outline" className="gap-1 border-amber-500 text-amber-700 bg-amber-50">
                      <Lock size={12} />
                      <span>Reviews Restricted</span>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-1">
                            Business Name
                            {sortConfig.key === 'name' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp size={14} /> : 
                                <ChevronDown size={14} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() => handleSort('rating')}
                        >
                          <div className="flex items-center gap-1">
                            Rating
                            {sortConfig.key === 'rating' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp size={14} /> : 
                                <ChevronDown size={14} />
                            )}
                          </div>
                        </TableHead>
                        {!areReviewsRestricted && (
                          <TableHead 
                            className="cursor-pointer hover:bg-slate-50"
                            onClick={() => handleSort('reviews')}
                          >
                            <div className="flex items-center gap-1">
                              Reviews
                              {sortConfig.key === 'reviews' && (
                                sortConfig.direction === 'ascending' ? 
                                  <ChevronUp size={14} /> : 
                                  <ChevronDown size={14} />
                              )}
                            </div>
                          </TableHead>
                        )}
                        <TableHead>Phone</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center gap-1">
                            Category
                            {sortConfig.key === 'category' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp size={14} /> : 
                                <ChevronDown size={14} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedResults.map((result) => (
                        <TableRow key={result.id} className="group hover:bg-slate-50">
                          <TableCell className="font-medium">{result.name}</TableCell>
                          <TableCell className="flex items-center gap-1">
                            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{result.address}</span>
                          </TableCell>
                          <TableCell>{result.city}</TableCell>
                          <TableCell>{result.state}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-400" />
                              <span>{result.rating}</span>
                            </div>
                          </TableCell>
                          {!areReviewsRestricted && (
                            <TableCell>{result.reviews}</TableCell>
                          )}
                          <TableCell>{result.phone}</TableCell>
                          <TableCell>{result.category}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              {areReviewsRestricted && (
                <CardFooter className="bg-amber-50 border-t border-amber-200 p-4">
                  <div className="w-full text-center">
                    <p className="text-amber-700 text-sm mb-2">
                      Reviews data is restricted. Upgrade to the Pro plan to access review data.
                    </p>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      onClick={() => navigate('/dashboard/billing')}
                    >
                      <Trophy size={14} />
                      <span>Upgrade to Pro</span>
                    </Button>
                  </div>
                </CardFooter>
              )}
              
              <CardFooter className="border-t border-slate-100 flex justify-center p-4">
                <Button variant="outline">Load More Results</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className={`${withDelay(animationClasses.scaleIn, 300)}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedResults.map((result) => (
                <Card key={result.id} className="overflow-hidden group">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="truncate">{result.name}</span>
                      <Badge variant="secondary" className="ml-2">{result.category}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <MapPin size={14} className="mr-1" />
                      <span className="truncate">{result.address}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span className="font-semibold">{result.rating}</span>
                      </div>
                      {!areReviewsRestricted && (
                        <div className="text-sm text-slate-500">
                          ({result.reviews} reviews)
                        </div>
                      )}
                    </div>
                    <div className="text-sm">{result.city}, {result.state}</div>
                    <div className="text-sm">{result.phone}</div>
                  </CardContent>
                  <div className="p-4 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <ExternalLink size={14} />
                      <span>View Details</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            {areReviewsRestricted && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-center">
                <p className="text-amber-700 mb-2">Reviews data is restricted. Upgrade to the Pro plan for full access.</p>
                <Button 
                  variant="default" 
                  size="sm"
                  className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  onClick={() => navigate('/dashboard/billing')}
                >
                  <Trophy size={14} />
                  <span>Upgrade to Pro</span>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className={`${withDelay(animationClasses.scaleIn, 300)}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Businesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">128</div>
                  <p className="text-sm text-slate-500">Based on your search criteria</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">4.5</div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Star size={14} className="text-yellow-400 mr-1" />
                    Across all businesses
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">Café</div>
                  <p className="text-sm text-slate-500">Most common business type</p>
                </CardContent>
              </Card>
            </div>
            
            {areReviewsRestricted && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <Lock size={16} />
                    Detailed Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 mb-4">
                    Upgrade to Pro to access advanced analytics including review analysis, 
                    popularity trends, and business performance insights.
                  </p>
                  <Button 
                    className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => navigate('/dashboard/billing')}
                  >
                    <TrendingUp size={14} className="mr-1" />
                    Unlock Advanced Analytics
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
          <h3 className="text-xl font-semibold mb-4">Get More from Your Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Export Options</h4>
                <p className="text-sm text-slate-600">
                  Export your data in multiple formats including CSV, Excel, and JSON.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-4">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Advanced Filtering</h4>
                <p className="text-sm text-slate-600">
                  Filter your results by category, rating, location and more.
                </p>
              </div>
            </div>
          </div>
          
          {areReviewsRestricted && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Ready to unlock all features?</h4>
                  <p className="text-sm text-slate-600">Upgrade to Pro for just $49.99/month</p>
                </div>
                <Button 
                  className="gap-1"
                  onClick={() => navigate('/dashboard/billing')}
                >
                  <span>Go to Billing</span>
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
