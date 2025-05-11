
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarHeader as Header } from "@/components/ui/sidebar";

export default function SidebarHeader() {
  return (
    <Header className="p-4 mt-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-violet-primary" />
        <Link to="/dashboard" className="text-xl font-semibold">
          MapScraper
        </Link>
      </div>
    </Header>
  );
}
