
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Filter, Star, ExternalLink, MapPin } from "lucide-react";

// Mock data for display purposes
const mockResults = [
  {
    id: 1,
    name: "The Coffee House",
    address: "123 Main St, New York, NY",
    rating: 4.7,
    reviews: 324,
    phone: "(212) 555-1234",
    category: "Café",
  },
  {
    id: 2,
    name: "Downtown Diner",
    address: "456 Broadway, New York, NY",
    rating: 4.2,
    reviews: 188,
    phone: "(212) 555-5678",
    category: "Restaurant",
  },
  {
    id: 3,
    name: "Central Park Bakery",
    address: "789 5th Ave, New York, NY",
    rating: 4.8,
    reviews: 412,
    phone: "(212) 555-9012",
    category: "Bakery",
  },
  {
    id: 4,
    name: "Empire State Burgers",
    address: "101 Park Ave, New York, NY",
    rating: 4.5,
    reviews: 256,
    phone: "(212) 555-3456",
    category: "Fast Food",
  },
  {
    id: 5,
    name: "Brooklyn Pizza Co.",
    address: "202 Atlantic Ave, Brooklyn, NY",
    rating: 4.6,
    reviews: 380,
    phone: "(718) 555-7890",
    category: "Restaurant",
  },
];

export default function ResultsDisplay() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Data Extraction Results
          </h2>
          <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
            Here's a sample of the data you'll get from our Google Maps scraper.
          </p>
        </div>

        <div className={`bg-white rounded-xl shadow-soft overflow-hidden ${withDelay(animationClasses.scaleIn, 300)}`}>
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">Search Results</h3>
              <p className="text-sm text-slate-500">Showing 5 of 128 results for "cafes in New York"</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter size={14} />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} />
                <span>Export CSV</span>
              </Button>
              <Button size="sm">View All Results</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of business data extracted from Google Maps.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResults.map((result) => (
                  <TableRow key={result.id} className="group hover:bg-slate-50">
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{result.address}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400" />
                        <span>{result.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{result.reviews}</TableCell>
                    <TableCell>{result.phone}</TableCell>
                    <TableCell>{result.category}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-center p-6 border-t border-slate-100">
            <Button variant="outline">Load More Results</Button>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-slate-50 rounded-xl p-6 border border-slate-100 ${withDelay(animationClasses.fadeIn, 400)}`}>
            <div className="font-semibold text-lg mb-2">Total Businesses</div>
            <div className="text-3xl font-bold text-primary mb-4">128</div>
            <div className="text-sm text-slate-500">Based on your search criteria</div>
          </div>
          
          <div className={`bg-slate-50 rounded-xl p-6 border border-slate-100 ${withDelay(animationClasses.fadeIn, 500)}`}>
            <div className="font-semibold text-lg mb-2">Average Rating</div>
            <div className="text-3xl font-bold text-primary mb-4">4.5</div>
            <div className="text-sm text-slate-500">Across all businesses</div>
          </div>
          
          <div className={`bg-slate-50 rounded-xl p-6 border border-slate-100 ${withDelay(animationClasses.fadeIn, 600)}`}>
            <div className="font-semibold text-lg mb-2">Top Category</div>
            <div className="text-3xl font-bold text-primary mb-4">Café</div>
            <div className="text-sm text-slate-500">Most common business type</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
