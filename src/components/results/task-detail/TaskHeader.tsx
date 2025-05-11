
import { motion } from "framer-motion";
import HeaderNavigation from "./HeaderNavigation";
import HeaderTitle from "./HeaderTitle";
import HeaderMetadata from "./HeaderMetadata";
import HeaderActions from "./HeaderActions";

interface TaskHeaderProps {
  title: string;
  status: string;
  createdAt?: string;
  location?: string;
  fields?: string[];
  resultUrl?: string;
  onRefresh: () => void;
}

export default function TaskHeader({
  title,
  status,
  createdAt,
  location,
  fields,
  resultUrl,
  onRefresh
}: TaskHeaderProps) {
  return (
    <div className="bg-white border-b py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-6">
          <HeaderNavigation onRefresh={onRefresh} />
          
          <div className="space-y-4">
            <HeaderTitle title={title} status={status} />
            <HeaderMetadata createdAt={createdAt} location={location} fields={fields} />
          </div>
          
          <HeaderActions resultUrl={resultUrl} />
        </div>
      </div>
    </div>
  );
}
