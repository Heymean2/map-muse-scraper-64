
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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

// Data types for multi-selection
const dataTypes = [
  { id: "title", label: "Title" },
  { id: "avg-rating", label: "Average Rating" },
  { id: "rating-count", label: "Rating Count" },
  { id: "phone", label: "Phone" },
  { id: "website", label: "Website" },
  { id: "address", label: "Address" },
  { id: "images", label: "Images" }
];

interface DataTypeSelectorProps {
  selectedDataTypes: string[];
  setSelectedDataTypes: (dataTypes: string[]) => void;
}

export default function DataTypeSelector({
  selectedDataTypes,
  setSelectedDataTypes,
}: DataTypeSelectorProps) {
  const [dataTypeOpen, setDataTypeOpen] = useState(false);
  
  // Handle data type selection
  const handleDataTypeSelect = (dataTypeId: string) => {
    // Create a new array based on the current selection
    const updatedDataTypes = selectedDataTypes.includes(dataTypeId)
      ? selectedDataTypes.filter(id => id !== dataTypeId)
      : [...selectedDataTypes, dataTypeId];
    
    // Call the setter with the new array directly
    setSelectedDataTypes(updatedDataTypes);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="data-type" className="flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          Data Types to Extract
        </Label>
        <span className="text-xs text-slate-500">
          {selectedDataTypes.length} selected
        </span>
      </div>
      
      {/* Data Type Dropdown Multi-select */}
      <Popover open={dataTypeOpen} onOpenChange={setDataTypeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={dataTypeOpen}
            className="w-full justify-between h-10"
          >
            {selectedDataTypes.length > 0
              ? `${selectedDataTypes.length} data type${selectedDataTypes.length > 1 ? 's' : ''} selected`
              : "Select data types..."}
            <ListChecks className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search data types..." className="h-9" />
            <CommandEmpty>No data type found.</CommandEmpty>
            <CommandGroup>
              <CommandList className="max-h-60 overflow-y-auto">
                {dataTypes.map((dataType) => (
                  <CommandItem
                    key={dataType.id}
                    value={dataType.id}
                    onSelect={() => handleDataTypeSelect(dataType.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Checkbox 
                        id={`data-type-${dataType.id}`}
                        checked={selectedDataTypes.includes(dataType.id)}
                        className="data-[state=checked]:bg-primary"
                        onCheckedChange={() => {}}
                      />
                      <span>{dataType.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Display selected data types */}
      {selectedDataTypes.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
          <div className="flex flex-wrap gap-1">
            {selectedDataTypes.map((dataTypeId) => {
              const dataType = dataTypes.find(dt => dt.id === dataTypeId);
              return (
                <div key={dataTypeId} className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-xs flex items-center">
                  {dataType?.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
