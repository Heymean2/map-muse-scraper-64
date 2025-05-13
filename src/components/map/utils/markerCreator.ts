
import { createCustomMarkerOverlay } from "./mapOverlays";

// Define types for map marker positions
export interface MarkerPosition {
  position: {
    lat: number;
    lng: number;
  };
  delay: number;
  size: 'md' | 'lg';
  name: string;
  rating: string;
}

/**
 * Creates custom markers on the map for each position
 */
export const createMarkers = (map: google.maps.Map, markerPositions: MarkerPosition[]) => {
  if (!window.google) return;
  
  const CustomMarkerOverlay = createCustomMarkerOverlay();
  if (!CustomMarkerOverlay) return;
  
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

export const getDefaultMarkerPositions = (): MarkerPosition[] => {
  return [
    { position: { lat: 37.7749, lng: -122.4194 }, delay: 0, size: 'md', name: "San Francisco Bistro", rating: "4.8" }, // San Francisco
    { position: { lat: 34.0522, lng: -118.2437 }, delay: 1, size: 'lg', name: "LA Gourmet", rating: "4.6" }, // Los Angeles
    { position: { lat: 32.7157, lng: -117.1611 }, delay: 2, size: 'md', name: "San Diego Cafe", rating: "4.7" }, // San Diego
    { position: { lat: 38.5816, lng: -121.4944 }, delay: 1.5, size: 'lg', name: "Sacramento Restaurant", rating: "4.5" }, // Sacramento
    { position: { lat: 36.7378, lng: -119.7871 }, delay: 0.5, size: 'md', name: "Fresno Diner", rating: "4.3" }, // Fresno
  ];
};
