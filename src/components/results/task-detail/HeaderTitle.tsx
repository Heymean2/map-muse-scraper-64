
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusIcon } from "./utils/statusUtils";

interface HeaderTitleProps {
  title: string;
  status: string;
  stage?: string;
}

export default function HeaderTitle({ title, status, stage }: HeaderTitleProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
      <div className="flex gap-1.5">
        <Badge className={`${getStatusColor(status)} ml-2 flex items-center gap-1 capitalize`}>
          {getStatusIcon(status)}
          {status}
        </Badge>
        
        {stage && stage !== status && (
          <Badge variant="outline" className="flex items-center gap-1 capitalize">
            {stage}
          </Badge>
        )}
      </div>
    </div>
  );
}
