
import { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapControls from "./MapControls";
import MapAttribution from "./MapAttribution";
import { createMarkers, getDefaultMarkerPositions } from "./utils/markerCreator";

export const GoogleMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  
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
