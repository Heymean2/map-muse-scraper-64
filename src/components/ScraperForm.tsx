
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withDelay, animationClasses } from "@/lib/animations";
import { MapPin, Search, Clock, Filter, Type, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Business categories
const categories = [
  "bus stop",
  "doctor",
  "dentist",
  "insurance agency",
  "atm",
  "attorney",
  "real estate agency",
  "real estate agent",
  "church",
  "building",
  "restaurant",
  "beauty salon",
  "auto repair shop",
  "corporate office",
  "medical clinic",
  "family practice physician",
  "pharmacy",
  "counselor",
  "internist",
  "general contractor",
  "chiropractor",
  "non-profit organization",
  "convenience store",
  "construction company",
  "park"
];

// Countries and states data
const countries = [
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" }
];

const statesByCountry = {
  us: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ],
  uk: [
    "England", "Scotland", "Wales", "Northern Ireland"
  ]
};

export default function ScraperForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [useKeyword, setUseKeyword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // New location related states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [showCountryError, setShowCountryError] = useState(false);
  const [selectAllStates, setSelectAllStates] = useState(false);
  const [stateSelectOpen, setStateSelectOpen] = useState(false);
  
  // Handle country change
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedStates([]);
    setSelectAllStates(false);
    setShowCountryError(false);
  };
  
  // Handle state selection
  const handleStateSelect = (state: string) => {
    if (!selectedStates.includes(state)) {
      setSelectedStates([...selectedStates, state]);
    } else {
      setSelectedStates(selectedStates.filter(s => s !== state));
    }
  };
  
  // Toggle select all states
  useEffect(() => {
    if (selectAllStates && selectedCountry) {
      setSelectedStates(statesByCountry[selectedCountry as keyof typeof statesByCountry]);
    } else if (!selectAllStates && selectedStates.length === statesByCountry[selectedCountry as keyof typeof statesByCountry]?.length) {
      setSelectedStates([]);
    }
  }, [selectAllStates, selectedCountry]);
  
  // Check if all states are selected to update the toggle
  useEffect(() => {
    if (selectedCountry && 
        selectedStates.length === statesByCountry[selectedCountry as keyof typeof statesByCountry]?.length) {
      setSelectAllStates(true);
    } else if (selectAllStates && selectedStates.length !== statesByCountry[selectedCountry as keyof typeof statesByCountry]?.length) {
      setSelectAllStates(false);
    }
  }, [selectedStates, selectedCountry]);
  
  // Validate state selection
  const handleStateClick = () => {
    if (!selectedCountry) {
      setShowCountryError(true);
      setStateSelectOpen(false);
    } else {
      setStateSelectOpen(!stateSelectOpen);
    }
  };
  
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="search-type">{useKeyword ? "What are you looking for?" : "Select a category"}</Label>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="use-keyword" className="text-sm">Use Keyword</Label>
                          <Switch 
                            id="use-keyword" 
                            checked={useKeyword} 
                            onCheckedChange={setUseKeyword} 
                          />
                        </div>
                      </div>
                      
                      {useKeyword ? (
                        <div className="relative">
                          <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                          <Input 
                            id="query"
                            placeholder="Enter search keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      ) : (
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between h-10"
                            >
                              {selectedCategory
                                ? selectedCategory
                                : "Select a category..."}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search category..." className="h-9" />
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList className="max-h-60 overflow-y-auto">
                                  {categories.map((category) => (
                                    <CommandItem
                                      key={category}
                                      value={category}
                                      onSelect={(currentValue) => {
                                        setSelectedCategory(currentValue);
                                        setOpen(false);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {category}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          selectedCategory === category
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      
                      <div className="space-y-3">
                        {/* Country Selection */}
                        <Select
                          value={selectedCountry}
                          onValueChange={handleCountryChange}
                        >
                          <SelectTrigger id="country-select" className="w-full">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.id} value={country.id}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* State Selection */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">States</span>
                            {selectedCountry && (
                              <div className="flex items-center space-x-2">
                                <Label htmlFor="select-all-states" className="text-sm">Select All</Label>
                                <Switch 
                                  id="select-all-states" 
                                  checked={selectAllStates} 
                                  onCheckedChange={setSelectAllStates}
                                  disabled={!selectedCountry}
                                />
                              </div>
                            )}
                          </div>
                          
                          <Popover open={stateSelectOpen} onOpenChange={setStateSelectOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={stateSelectOpen}
                                className="w-full justify-between h-10"
                                onClick={handleStateClick}
                              >
                                {selectedStates.length > 0
                                  ? `${selectedStates.length} state${selectedStates.length > 1 ? 's' : ''} selected`
                                  : "Select states..."}
                                <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            
                            {selectedCountry && (
                              <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search states..." className="h-9" />
                                  <CommandEmpty>No state found.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandList className="max-h-60 overflow-y-auto">
                                      {selectedCountry && statesByCountry[selectedCountry as keyof typeof statesByCountry].map((state) => (
                                        <CommandItem
                                          key={state}
                                          value={state}
                                          onSelect={() => handleStateSelect(state)}
                                          className="cursor-pointer"
                                        >
                                          {state}
                                          <Check
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              selectedStates.includes(state)
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            )}
                          </Popover>
                          
                          {showCountryError && (
                            <Alert variant="destructive" className="mt-2 py-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Please select a country first
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        {/* Display selected states */}
                        {selectedStates.length > 0 && (
                          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                            <div className="flex flex-wrap gap-1">
                              {selectedStates.map((state) => (
                                <div key={state} className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-xs flex items-center">
                                  {state}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-type">Data Type</Label>
                      <Select defaultValue="business">
                        <SelectTrigger id="data-type">
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="avg-rating">Average Rating</SelectItem>
                          <SelectItem value="rating-count">Rating Count</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="address">Address</SelectItem>
                          <SelectItem value="images">Images</SelectItem>
                          <SelectItem value="all">All Available Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Start Scraping"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="preview" className={withDelay(animationClasses.fadeIn, 400)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="data">Sample Data</TabsTrigger>
                <TabsTrigger value="code">API</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Map Preview</CardTitle>
                    <CardDescription>
                      See the area your search will cover
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-md overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800">
                      <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0,0/800x450?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center rounded-md"></div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={16} />
                        <span>Estimated completion time: 2-5 minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="data" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Data Output</CardTitle>
                    <CardDescription>
                      Preview of the data you'll receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md overflow-auto max-h-[400px]">
                      <pre className="text-xs text-slate-800 dark:text-slate-200">
{`[
  {
    "name": "Central Coffee Shop",
    "address": "123 Main St, New York, NY 10001",
    "phone": "(212) 555-1234",
    "website": "https://centralcoffee.example.com",
    "rating": 4.7,
    "reviews": 324,
    "categories": ["Café", "Coffee Shop", "Breakfast"],
    "hours": {
      "Monday": "7:00 AM – 8:00 PM",
      "Tuesday": "7:00 AM – 8:00 PM",
      "Wednesday": "7:00 AM – 8:00 PM",
      "Thursday": "7:00 AM – 8:00 PM",
      "Friday": "7:00 AM – 9:00 PM",
      "Saturday": "8:00 AM – 9:00 PM",
      "Sunday": "8:00 AM – 7:00 PM"
    },
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  // More entries...
]`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Integration</CardTitle>
                    <CardDescription>
                      Use our API for programmatic access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900 p-4 rounded-md overflow-auto max-h-[400px]">
                      <pre className="text-xs text-slate-200">
{`// Example API request
const response = await fetch('https://api.mapscraper.com/v1/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    query: 'restaurants',
    location: 'New York, NY',
    radius: 10,
    dataType: 'business'
  })
});

const data = await response.json();
console.log(data);`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
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
          </div>
        </div>
      </Container>
    </section>
  );
}
