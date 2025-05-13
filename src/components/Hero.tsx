
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { withDelay, animationClasses } from "@/lib/animations";
import { MapPin, Navigation, Search, X, Plus, Minus } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox token here - Replace with your actual token when deploying
// This is a temporary public token for development
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export default function Hero() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-119.4179, 36.7783], // California
      zoom: 5,
      interactive: false, // Disable interactions for the preview map
    });
    
    mapInstanceRef.current = map;
    
    map.on('load', () => {
      setMapLoaded(true);
      
      // Add some markers after map is loaded
      if (markersRef.current) {
        const markerPositions = [
          { lngLat: [-122.4194, 37.7749], delay: 0, size: 'md', name: "San Francisco Bistro", rating: "4.8" }, // San Francisco
          { lngLat: [-118.2437, 34.0522], delay: 1, size: 'lg', name: "LA Gourmet", rating: "4.6" }, // Los Angeles
          { lngLat: [-117.1611, 32.7157], delay: 2, size: 'md', name: "San Diego Cafe", rating: "4.7" }, // San Diego
          { lngLat: [-121.4944, 38.5816], delay: 1.5, size: 'lg', name: "Sacramento Restaurant", rating: "4.5" }, // Sacramento
          { lngLat: [-119.7871, 36.7378], delay: 0.5, size: 'md', name: "Fresno Diner", rating: "4.3" }, // Fresno
        ];
        
        markerPositions.forEach(pos => {
          // Create marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'absolute cursor-pointer transition-all duration-300 z-10';
          markerElement.style.transform = 'scale(0)';
          
          // Create the Mapbox marker
          const marker = new mapboxgl.Marker({
            element: markerElement,
            anchor: 'bottom'
          })
            .setLngLat(pos.lngLat)
            .addTo(map);
            
          // Create marker pin
          const markerPin = document.createElement('div');
          markerPin.className = `flex items-center justify-center ${pos.size === 'lg' ? 'text-red-500' : 'text-red-400'} drop-shadow-md`;
          
          // Use MapPin icon
          const pinSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          pinSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          pinSvg.setAttribute('width', pos.size === 'lg' ? '32' : '24');
          pinSvg.setAttribute('height', pos.size === 'lg' ? '32' : '24');
          pinSvg.setAttribute('viewBox', '0 0 24 24');
          pinSvg.setAttribute('fill', 'none');
          pinSvg.setAttribute('stroke', 'currentColor');
          pinSvg.setAttribute('stroke-width', '2');
          pinSvg.setAttribute('stroke-linecap', 'round');
          pinSvg.setAttribute('stroke-linejoin', 'round');
          
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', '12');
          circle.setAttribute('cy', '10');
          circle.setAttribute('r', '3');
          
          pinSvg.appendChild(path);
          pinSvg.appendChild(circle);
          markerPin.appendChild(pinSvg);
          
          // Add info window (appears on hover)
          const infoWindow = document.createElement('div');
          infoWindow.className = 'absolute left-2/4 -translate-x-1/2 -translate-y-full mb-1 bg-white rounded-md p-2 shadow-md border border-gray-200 w-48 opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-20';
          infoWindow.style.bottom = '100%';
          infoWindow.innerHTML = `
            <div class="text-sm font-medium">${pos.name}</div>
            <div class="text-xs text-gray-500">Fine Dining • ${pos.rating} ★★★★☆</div>
            <div class="text-xs text-gray-500">123 Main St, California</div>
          `;
          
          // Create marker shadow/pulse effect
          const pulse = document.createElement('div');
          pulse.className = 'absolute top-0 left-0 w-full h-full animate-ping rounded-full bg-red-500/30';
          
          markerPin.appendChild(pulse);
          markerElement.appendChild(markerPin);
          markerElement.appendChild(infoWindow);
          
          // Add event listeners for hover effect
          markerElement.addEventListener('mouseenter', () => {
            infoWindow.style.opacity = '1';
            markerElement.style.zIndex = '10';
          });
          
          markerElement.addEventListener('mouseleave', () => {
            infoWindow.style.opacity = '0';
            markerElement.style.zIndex = '1';
          });
          
          // Animate marker appearance with delay
          setTimeout(() => {
            markerElement.style.transform = 'scale(1)';
          }, pos.delay * 1000);
        });
      }
    });
    
    // Clean up on unmount
    return () => {
      map.remove();
      if (markersRef.current) {
        markersRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section id="home" className="pt-32 pb-24 overflow-hidden">
      <Container className="relative">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-40 -z-10 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/10 text-accent rounded-full ${withDelay(animationClasses.fadeIn, 100)}`}>
            <span className="relative">Google Maps Data at Your Fingertips</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 ${withDelay(animationClasses.slideUp, 200)}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Extract Valuable Data</span> from Google Maps with Ease
          </h1>
          
          <p className={`text-xl text-slate-600 max-w-2xl mx-auto mb-8 ${withDelay(animationClasses.slideUp, 300)}`}>
            The most powerful and intuitive tool for extracting business data from Google Maps. Save hours of manual research and get more leads.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${withDelay(animationClasses.slideUp, 400)}`}>
            <Link to="/auth?tab=signup">
              <Button size="lg" className="min-w-[150px] h-12 text-base group">
                <span>Start Scraping Now</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </Link>
            <Link to="#how-it-works">
              <Button size="lg" variant="outline" className="min-w-[150px] h-12 text-base">
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className={`mt-12 flex items-center justify-center gap-6 ${withDelay(animationClasses.fadeIn, 500)}`}>
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold">2,500+</span> companies already scraping
            </div>
          </div>
        </div>

        {/* Interactive Google Maps Preview */}
        <div className={`relative mx-auto max-w-5xl ${withDelay(animationClasses.scaleIn, 600)}`}>
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200 transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-white/80 backdrop-blur-sm p-6 rounded-xl overflow-hidden">
                {/* Search bar simulation */}
                <div className="h-12 w-full bg-white rounded-lg mb-6 flex items-center px-4 shadow-sm border border-slate-200">
                  <div className="mr-3 text-slate-400">
                    <Search size={18} />
                  </div>
                  <div className="flex-grow font-medium text-slate-700 text-sm">
                    restaurants in California, USA
                  </div>
                  <div className="ml-2 text-slate-400">
                    <X size={18} />
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-6 h-[calc(100%-4rem)]">
                  {/* Results panel */}
                  <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm border border-slate-100 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-base font-medium text-slate-800">Results</div>
                      <div className="text-sm text-blue-600">Share</div>
                    </div>
                    
                    {/* Result items */}
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="mb-4 pb-4 border-b border-slate-100">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium text-slate-800">
                              {["The Elderberry House", "Californios", "Aroma Tavern"][i]}
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-amber-500 mr-1">4.7</span>
                              <span className="text-amber-500">★★★★</span>
                              <span className="text-amber-300">☆</span>
                              <span className="text-slate-500 ml-1">({[332, 482, 92][i]})</span>
                              <span className="mx-1 text-slate-300">•</span>
                              <span className="text-slate-500">$$$</span>
                            </div>
                            <div className="text-sm text-slate-500">Fine Dining</div>
                            <div className="text-sm text-slate-500">
                              <span className="text-red-500">Closed</span> • Opens 5 pm
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Map container */}
                  <div className="col-span-3 bg-slate-100 rounded-lg relative overflow-hidden">
                    <div 
                      ref={mapRef} 
                      className="w-full h-full rounded-lg relative transition-transform duration-200"
                    >
                      {/* Map will be rendered here by Mapbox */}
                    </div>
                    
                    {/* Map controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      <div className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-50">
                        <Plus size={18} />
                      </div>
                      <div className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-50">
                        <Minus size={18} />
                      </div>
                    </div>
                    
                    {/* Map markers container */}
                    <div ref={markersRef} className="absolute inset-0 z-10">
                      {/* Markers will be added here dynamically */}
                    </div>
                    
                    {/* Map attribution */}
                    <div className="absolute bottom-1 right-1 text-[10px] text-slate-500 bg-white/80 px-1 rounded z-10">
                      Map data ©2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-accent/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="text-sm font-medium text-accent">Beautiful and intuitive interface for scraping data</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
