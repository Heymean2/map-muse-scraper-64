
import { format } from "date-fns";

interface HeaderMetadataProps {
  createdAt?: string;
  location?: string;
  fields?: string[];
}

export default function HeaderMetadata({ createdAt, location, fields }: HeaderMetadataProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {createdAt && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-700">Created:</span>
            <span>{createdAt && format(new Date(createdAt), "MMM d, yyyy")}</span>
          </div>
        )}
        
        {location && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-700">Location:</span>
            <span>{location}</span>
          </div>
        )}
      </div>
      
      {fields && fields.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-sm">
          <span className="text-slate-700">Fields:</span>
          <span className="text-slate-600">{fields.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
