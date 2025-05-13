
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { withDelay, animationClasses } from "@/lib/animations";
import { MapPin, Navigation, Search, X, Plus, Minus } from "lucide-react";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Hero() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Load Google Maps API
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCO_4EAGHtC0BfJjSQxskSp4DrbjJnTQAM&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    googleMapScript.onload = () => {
      // Initialize the map
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 36.7783, lng: -119.4179 }, // California
        zoom: 6,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#7c93a3" }, { lightness: -10 }]
          },
          {
            featureType: "administrative.country",
            elementType: "geometry",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "administrative.province",
            elementType: "geometry.stroke",
            stylers: [{ color: "#a0c7e5" }, { visibility: "on" }]
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry",
            stylers: [{ color: "#f7f7f7" }]
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#f7f7f7" }]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#a0c7e5" }]
          }
        ]
      });
      
      mapInstanceRef.current = map;
      setMapLoaded(true);
      
      // Add some markers after map is loaded
      const markerPositions = [
        { position: { lat: 37.7749, lng: -122.4194 }, delay: 0, size: 'md', name: "San Francisco Bistro", rating: "4.8" }, // San Francisco
        { position: { lat: 34.0522, lng: -118.2437 }, delay: 1, size: 'lg', name: "LA Gourmet", rating: "4.6" }, // Los Angeles
        { position: { lat: 32.7157, lng: -117.1611 }, delay: 2, size: 'md', name: "San Diego Cafe", rating: "4.7" }, // San Diego
        { position: { lat: 38.5816, lng: -121.4944 }, delay: 1.5, size: 'lg', name: "Sacramento Restaurant", rating: "4.5" }, // Sacramento
        { position: { lat: 36.7378, lng: -119.7871 }, delay: 0.5, size: 'md', name: "Fresno Diner", rating: "4.3" }, // Fresno
      ];
      
      markerPositions.forEach(pos => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          position: absolute;
          transform: scale(0);
          transition: transform 0.3s ease;
          cursor: pointer;
        `;

        // Create marker pin
        const markerPin = document.createElement('div');
        markerPin.className = `flex items-center justify-center ${pos.size === 'lg' ? 'text-red-500' : 'text-red-400'}`;
        
        // Create SVG for the pin
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', pos.size === 'lg' ? '32' : '24');
        svg.setAttribute('height', pos.size === 'lg' ? '32' : '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '10');
        circle.setAttribute('r', '3');
        
        svg.appendChild(path);
        svg.appendChild(circle);
        markerPin.appendChild(svg);
        
        // Create info window (appears on hover)
        const infoWindow = document.createElement('div');
        infoWindow.className = 'bg-white rounded-md p-2 shadow-md border border-gray-200 w-48 opacity-0 transition-opacity pointer-events-none';
        infoWindow.style.cssText = `
          position: absolute;
          left: 50%;
          bottom: 100%;
          transform: translateX(-50%) translateY(-4px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 20;
          pointer-events: none;
        `;
        
        infoWindow.innerHTML = `
          <div class="text-sm font-medium">${pos.name}</div>
          <div class="text-xs text-gray-500">Fine Dining • ${pos.rating} ★★★★☆</div>
          <div class="text-xs text-gray-500">123 Main St, California</div>
        `;
        
        // Create marker shadow/pulse effect
        const pulse = document.createElement('div');
        pulse.className = 'absolute top-0 left-0 w-full h-full animate-ping rounded-full';
        pulse.style.cssText = `
          background-color: rgba(239, 68, 68, 0.3); 
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        `;
        
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
        
        // Create custom overlay for Google Maps
        class CustomMarkerOverlay extends google.maps.OverlayView {
          private position: google.maps.LatLng;
          private element: HTMLElement;
          
          constructor(position: google.maps.LatLng | google.maps.LatLngLiteral, element: HTMLElement) {
            super();
            this.position = position instanceof google.maps.LatLng ? position : new google.maps.LatLng(position);
            this.element = element;
          }
          
          onAdd() {
            const panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(this.element);
          }
          
          draw() {
            const projection = this.getProjection();
            if (!projection) return;
            
            const point = projection.fromLatLngToDivPixel(this.position)!;
            this.element.style.left = `${point.x - (this.element.offsetWidth / 2)}px`;
            this.element.style.top = `${point.y - this.element.offsetHeight}px`;
          }
          
          onRemove() {
            if (this.element.parentNode) {
              this.element.parentNode.removeChild(this.element);
            }
          }
        }
        
        // Add custom marker to map
        const overlay = new CustomMarkerOverlay(pos.position, markerElement);
        overlay.setMap(map);
        
        // Animate marker appearance with delay
        setTimeout(() => {
          markerElement.style.transform = 'scale(1)';
        }, pos.delay * 1000);
      });
    };
    
    document.head.appendChild(googleMapScript);
    
    // Clean up on unmount
    return () => {
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
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
                      {/* Map will be rendered here by Google Maps */}
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
                      Map data ©2025 Google
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
