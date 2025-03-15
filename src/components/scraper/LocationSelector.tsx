
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

  return (
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
  );
}
