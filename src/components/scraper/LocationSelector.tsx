
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQuery } from "@tanstack/react-query";
import { getScraperCountries, getScraperStates } from "@/services/scraper/formOptions";

interface LocationSelectorProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
}

export default function LocationSelector({
  selectedCountry,
  setSelectedCountry,
  selectedStates,
  setSelectedStates,
}: LocationSelectorProps) {
  const [showCountryError, setShowCountryError] = useState(false);
  const [selectAllStates, setSelectAllStates] = useState(false);
  const [stateSelectOpen, setStateSelectOpen] = useState(false);
  
  // Fetch countries from Supabase
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['scraperCountries'],
    queryFn: getScraperCountries,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Fetch states for selected country
  const { data: states = [], isLoading: isLoadingStates } = useQuery({
    queryKey: ['scraperStates', selectedCountry],
    queryFn: () => getScraperStates(selectedCountry),
    enabled: !!selectedCountry,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Handle country change
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedStates([]);
    setSelectAllStates(false);
    setShowCountryError(false);
  };
  
  // Handle state selection
  const handleStateSelect = (stateName: string) => {
    if (!selectedStates.includes(stateName)) {
      setSelectedStates([...selectedStates, stateName]);
    } else {
      setSelectedStates(selectedStates.filter(s => s !== stateName));
    }
  };
  
  // Toggle select all states
  useEffect(() => {
    if (selectAllStates && selectedCountry && states.length > 0) {
      setSelectedStates(states.map(state => state.name));
    } else if (!selectAllStates && selectedStates.length === states.length && states.length > 0) {
      setSelectedStates([]);
    }
  }, [selectAllStates, selectedCountry, states]);
  
  // Check if all states are selected to update the toggle
  useEffect(() => {
    if (selectedCountry && states.length > 0 && 
        selectedStates.length === states.length) {
      setSelectAllStates(true);
    } else if (selectAllStates && selectedStates.length !== states.length && states.length > 0) {
      setSelectAllStates(false);
    }
  }, [selectedStates, selectedCountry, states]);
  
  // Validate state selection
  const handleStateClick = () => {
    if (!selectedCountry) {
      setShowCountryError(true);
      setStateSelectOpen(false);
    } else {
      setStateSelectOpen(!stateSelectOpen);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">2. Location</Label>
      
      <div className="space-y-3">
        {/* Country Selection */}
        <Select
          value={selectedCountry}
          onValueChange={handleCountryChange}
          disabled={isLoadingCountries}
        >
          <SelectTrigger id="country-select" className="w-full">
            <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select a country"} />
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
            {selectedCountry && !isLoadingStates && states.length > 0 && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="select-all-states" className="text-sm">Select All</Label>
                <Switch 
                  id="select-all-states" 
                  checked={selectAllStates} 
                  onCheckedChange={setSelectAllStates}
                  disabled={!selectedCountry || isLoadingStates}
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
                disabled={isLoadingStates && !!selectedCountry}
              >
                {isLoadingStates && selectedCountry ? "Loading states..." :
                  selectedStates.length > 0
                    ? `${selectedStates.length} state${selectedStates.length > 1 ? 's' : ''} selected`
                    : "Select states..."}
                <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            
            {selectedCountry && (
              <PopoverContent className="w-full p-0" align="start" sideOffset={5}
                style={{ animationDuration: '200ms' }}>
                <Command>
                  <CommandInput placeholder="Search states..." className="h-9" />
                  <CommandEmpty>No state found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList className="max-h-60 overflow-y-auto">
                      {states.map((state) => (
                        <CommandItem
                          key={state.id}
                          value={state.name}
                          onSelect={() => handleStateSelect(state.name)}
                          className="cursor-pointer"
                        >
                          {state.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedStates.includes(state.name)
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
      <p className="text-xs text-slate-500 mt-1">Select the geographic area to search</p>
    </div>
  );
}
