
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";
import { LockIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataTypeSelectorProps {
  selectedDataTypes: string[];
  setSelectedDataTypes: (types: string[]) => void;
}

export default function DataTypeSelector({ selectedDataTypes, setSelectedDataTypes }: DataTypeSelectorProps) {
  const { user } = useAuth();
  
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

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-medium mb-1">3. Select Data to Extract</h3>
        <p className="text-xs text-slate-500">Choose what business information you want to collect.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dataTypes.map((dataType) => (
          <div key={dataType.id} className="flex items-center space-x-2">
            <TooltipProvider>
              <div className="flex items-center">
                <Checkbox
                  id={`data-type-${dataType.id}`}
                  checked={selectedDataTypes.includes(dataType.id)}
                  onCheckedChange={() => toggleDataType(dataType.id)}
                  disabled={isRestricted(dataType.id)}
                  className={isRestricted(dataType.id) ? "opacity-50" : ""}
                />
                <Label
                  htmlFor={`data-type-${dataType.id}`}
                  className={`ml-2 text-sm ${isRestricted(dataType.id) ? "opacity-50" : ""}`}
                >
                  {dataType.label}
                </Label>
                
                {isRestricted(dataType.id) && (
                  <Tooltip>
                    <TooltipTrigger>
                      <LockIcon className="h-3.5 w-3.5 ml-1 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Available in Pro plan</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>
        ))}
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
