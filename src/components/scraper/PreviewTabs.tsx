
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function PreviewTabs() {
  return (
    <Tabs defaultValue="preview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="data">Sample Data</TabsTrigger>
        <TabsTrigger value="code">API</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Map Preview</CardTitle>
            <CardDescription>
              See the area your search will cover
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-md overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800">
              <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0,0/800x450?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center rounded-md"></div>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>Estimated completion time: 2-5 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="data" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Sample Data Output</CardTitle>
            <CardDescription>
              Preview of the data you'll receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-xs text-slate-800 dark:text-slate-200">
{`[
  {
    "name": "Central Coffee Shop",
    "address": "123 Main St, New York, NY 10001",
    "phone": "(212) 555-1234",
    "website": "https://centralcoffee.example.com",
    "rating": 4.7,
    "reviews": 324,
    "categories": ["Café", "Coffee Shop", "Breakfast"],
    "hours": {
      "Monday": "7:00 AM – 8:00 PM",
      "Tuesday": "7:00 AM – 8:00 PM",
      "Wednesday": "7:00 AM ��� 8:00 PM",
      "Thursday": "7:00 AM – 8:00 PM",
      "Friday": "7:00 AM – 9:00 PM",
      "Saturday": "8:00 AM – 9:00 PM",
      "Sunday": "8:00 AM – 7:00 PM"
    },
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  // More entries...
]`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="code" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>
              Use our API for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-xs text-slate-200">
{`// Example API request
const response = await fetch('https://api.mapscraper.com/v1/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    query: 'restaurants',
    location: 'New York, NY',
    radius: 10,
    dataType: 'business'
  })
});

const data = await response.json();
console.log(data);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
