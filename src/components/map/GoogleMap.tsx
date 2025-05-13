import { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Plus, Minus } from "lucide-react";

// Define types for map marker positions
interface MarkerPosition {
  position: {
    lat: number;
    lng: number;
  };
  delay: number;
  size: 'md' | 'lg';
  name: string;
  rating: string;
}

export const GoogleMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  
  // Custom marker overlay for Google Maps - defined inside the component
  // so it's only created after the Google Maps API is loaded
  const createCustomMarkerOverlay = () => {
    if (!window.google) return null;
    
    return class CustomMarkerOverlay extends google.maps.OverlayView {
      private position: google.maps.LatLng;
      private element: HTMLElement;
      
      constructor(position: google.maps.LatLng | google.maps.LatLngLiteral, element: HTMLElement) {
        super();
        this.position = position instanceof google.maps.LatLng 
          ? position 
          : new google.maps.LatLng(position.lat, position.lng);
        this.element = element;
      }
      
      onAdd() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.element);
      }
      
      draw() {
        const projection = this.getProjection();
        if (!projection) return;
        
        const point = projection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.element.style.left = `${point.x - (this.element.offsetWidth / 2)}px`;
          this.element.style.top = `${point.y - this.element.offsetHeight}px`;
        }
      }
      
      onRemove() {
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }
    };
  };
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      initializeMap();
      return;
    }
    
    // Load Google Maps API
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCO_4EAGHtC0BfJjSQxskSp4DrbjJnTQAM&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    googleMapScript.onload = () => {
      setMapsLoaded(true);
      initializeMap();
    };
    
    document.head.appendChild(googleMapScript);
    
    // Clean up on unmount
    return () => {
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
      }
    };
  }, []);
  
  // Initialize map after Google Maps API is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;
    
    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
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
    
    // Add markers only after map is loaded and CustomMarkerOverlay is available
    const CustomMarkerOverlay = createCustomMarkerOverlay();
    if (!CustomMarkerOverlay) return;
    
    // Add some markers after map is loaded
    const markerPositions: MarkerPosition[] = [
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
      
      // Add custom marker to map
      const overlay = new CustomMarkerOverlay(pos.position, markerElement);
      overlay.setMap(map);
      
      // Animate marker appearance with delay
      setTimeout(() => {
        markerElement.style.transform = 'scale(1)';
      }, pos.delay * 1000);
    });
  };

  return (
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
  );
};

// Add type declaration for Google Maps API to window object
declare global {
  interface Window {
    google: typeof google;
  }
}

export default GoogleMap;
