
import { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapControls from "./MapControls";
import MapAttribution from "./MapAttribution";
import { createMarkers, getDefaultMarkerPositions } from "./utils/markerCreator";
import { motion } from "framer-motion";

export const GoogleMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isScrapingActive, setIsScrapingActive] = useState(true);
  
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

  // Scraping animation timer
  useEffect(() => {
    // After 10 seconds, stop the scraping animation to simulate completion
    const timer = setTimeout(() => {
      setIsScrapingActive(false);
    }, 10000);
    
    return () => clearTimeout(timer);
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
    
    // Add markers after map is loaded
    createMarkers(map, getDefaultMarkerPositions());
  };
  
  // Handle zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 0;
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };
  
  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 0;
      mapInstanceRef.current.setZoom(Math.max(1, currentZoom - 1));
    }
  };

  return (
    <div className="col-span-3 bg-slate-100 rounded-lg relative overflow-hidden">
      {/* Overlay animation when scraping is active */}
      {isScrapingActive && (
        <div className="absolute inset-0 z-20 bg-white/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="max-w-xs w-full bg-white/90 rounded-lg p-4 shadow-lg border border-violet-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                className="h-4 w-4 rounded-full bg-violet-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-medium text-violet-primary">Scraping data...</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-violet-primary"
                initial={{ width: "15%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "easeInOut" }}
              />
            </div>
          </div>
          
          {/* Animated search pins */}
          <motion.div
            className="absolute w-10 h-10 border-4 border-violet-primary rounded-full"
            initial={{ scale: 0, x: -50, y: -80, opacity: 0 }}
            animate={{ scale: [0, 1, 1, 0], x: [-50, -100, -100, -100], y: [-80, -120, -120, -120], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          />
          
          <motion.div
            className="absolute w-10 h-10 border-4 border-violet-primary rounded-full"
            initial={{ scale: 0, x: 100, y: 50, opacity: 0 }}
            animate={{ scale: [0, 1, 1, 0], x: [100, 150, 150, 150], y: [50, 80, 80, 80], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 4 }}
          />
          
          <motion.div
            className="absolute w-10 h-10 border-4 border-violet-primary rounded-full"
            initial={{ scale: 0, x: -80, y: 100, opacity: 0 }}
            animate={{ scale: [0, 1, 1, 0], x: [-80, -130, -130, -130], y: [100, 120, 120, 120], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 3.5 }}
          />
          
          {/* Data points being collected */}
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-violet-primary rounded-full shadow-lg"
              initial={{ 
                x: Math.random() * 300 - 150, 
                y: Math.random() * 300 - 150,
                opacity: 0 
              }}
              animate={{ 
                x: 0,
                y: 0,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.8,
                repeat: Infinity,
                repeatDelay: 4
              }}
            />
          ))}
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg relative transition-transform duration-200"
      >
        {/* Map will be rendered here by Google Maps */}
      </div>
      
      {/* Map controls */}
      <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      
      {/* Map markers container */}
      <div ref={markersRef} className="absolute inset-0 z-10">
        {/* Markers will be added here dynamically */}
      </div>
      
      {/* Map attribution */}
      <MapAttribution />
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
