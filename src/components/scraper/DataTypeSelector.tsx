
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";
import { LockIcon, InfoIcon, CheckIcon, X, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTypeSelectorProps {
  selectedDataTypes: string[];
  setSelectedDataTypes: (types: string[]) => void;
}

export default function DataTypeSelector({ selectedDataTypes, setSelectedDataTypes }: DataTypeSelectorProps) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Get user's plan info to check restrictions
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo,
    enabled: !!user
  });

  // Define data types and their restrictions based on plan
  const dataTypes = [
    { id: "name", label: "Business Name", restrictedToPlans: [] },
    { id: "address", label: "Address", restrictedToPlans: [] },
    { id: "phone", label: "Phone Number", restrictedToPlans: [] },
    { id: "website", label: "Website", restrictedToPlans: [] },
    { id: "category", label: "Category", restrictedToPlans: [] },
    { id: "city", label: "City", restrictedToPlans: [] },
    { id: "state", label: "State", restrictedToPlans: [] },
    { id: "reviews", label: "Reviews", restrictedToPlans: ["pro", "enterprise"] },
    { id: "hours", label: "Hours", restrictedToPlans: [] },
    { id: "rating", label: "Rating", restrictedToPlans: [] }
  ];
  
  // Filter available data types based on user's plan
  const availableDataTypes = useMemo(() => {
    const currentPlan = planInfo?.planName?.toLowerCase() || "free";
    return dataTypes.filter(dataType => {
      if (dataType.restrictedToPlans.length === 0) return true;
      return dataType.restrictedToPlans.some(plan => currentPlan.includes(plan));
    });
  }, [planInfo?.planName]);
  
  // Check if a data type is restricted for current user plan
  const isRestricted = (dataTypeId: string) => {
    const dataType = dataTypes.find(dt => dt.id === dataTypeId);
    if (!dataType) return false;
    
    const currentPlan = planInfo?.planName?.toLowerCase() || "free";
    return dataType.restrictedToPlans.length > 0 && 
           !dataType.restrictedToPlans.some(plan => currentPlan.includes(plan));
  };

  const toggleDataType = (dataTypeId: string) => {
    if (isRestricted(dataTypeId)) return;
    
    if (selectedDataTypes.includes(dataTypeId)) {
      setSelectedDataTypes(selectedDataTypes.filter(id => id !== dataTypeId));
    } else {
      setSelectedDataTypes([...selectedDataTypes, dataTypeId]);
    }
  };
  
  const selectAll = () => {
    const availableIds = availableDataTypes.map(dt => dt.id);
    setSelectedDataTypes(availableIds);
  };
  
  const clearAll = () => {
    setSelectedDataTypes([]);
  };

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-medium mb-1">3. Select Data to Extract</h3>
        <p className="text-xs text-slate-500">Choose what business information you want to collect.</p>
      </div>
      
      <div className="space-y-4">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between border-dashed"
            >
              <span>
                {selectedDataTypes.length === 0 ? (
                  "Select data types..."
                ) : (
                  `Selected ${selectedDataTypes.length} data type${selectedDataTypes.length !== 1 ? 's' : ''}`
                )}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[250px]" align="start">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Data Types</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="h-7 text-xs px-2"
                >
                  Clear
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={selectAll}
                  className="h-7 text-xs px-2"
                >
                  Select All
                </Button>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[calc(10*36px)] overflow-auto">
              {dataTypes.map((dataType) => {
                const isSelected = selectedDataTypes.includes(dataType.id);
                const isDisabled = isRestricted(dataType.id);
                
                return (
                  <DropdownMenuCheckboxItem
                    key={dataType.id}
                    checked={isSelected}
                    onSelect={(e) => {
                      e.preventDefault();
                      if (!isDisabled) {
                        toggleDataType(dataType.id);
                      }
                    }}
                    disabled={isDisabled}
                    className={`${isDisabled ? "opacity-50" : ""} cursor-pointer flex items-center justify-between`}
                  >
                    <span>{dataType.label}</span>
                    <div className="flex items-center">
                      {isSelected && !isDisabled && <CheckIcon className="h-4 w-4 ml-2 text-primary" />}
                      {isDisabled && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <LockIcon className="h-3.5 w-3.5 ml-1 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Available in Pro plan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </DropdownMenuCheckboxItem>
                );
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Selected data types badges */}
        {selectedDataTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedDataTypes.map(id => {
              const dataType = dataTypes.find(dt => dt.id === id);
              if (!dataType) return null;
              
              return (
                <Badge 
                  key={id} 
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1 animate-fade-in"
                >
                  {dataType.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleDataType(id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      
      {selectedDataTypes.length === 0 && (
        <p className="text-xs text-amber-500 mt-2 flex items-center">
          <InfoIcon className="h-3 w-3 mr-1" />
          Please select at least one data type
        </p>
      )}
    </div>
  );
}
