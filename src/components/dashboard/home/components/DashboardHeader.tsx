
import { MapPin } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="mb-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full -z-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-google-red/5 rounded-full -z-10 blur-xl"></div>
      
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <MapPin className="h-8 w-8 text-google-red" />
        Dashboard
      </h1>
      <p className="text-muted-foreground mt-1">Monitor your scraping tasks and usage</p>
    </div>
  );
}
