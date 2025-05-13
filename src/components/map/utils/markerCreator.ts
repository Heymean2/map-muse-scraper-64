
// This file contains utility functions to create and position markers on the map

export const getDefaultMarkerPositions = () => {
  return [
    { lat: 37.7749, lng: -122.4194, title: 'San Francisco' }, // San Francisco
    { lat: 34.0522, lng: -118.2437, title: 'Los Angeles' },   // Los Angeles
    { lat: 32.7157, lng: -117.1611, title: 'San Diego' },     // San Diego
    { lat: 38.5816, lng: -121.4944, title: 'Sacramento' },    // Sacramento
    { lat: 36.7783, lng: -119.4179, title: 'Fresno' }         // Fresno
  ];
};

export const createMarkers = (map: google.maps.Map, locations: Array<{lat: number, lng: number, title: string}>) => {
  locations.forEach(location => {
    // Create a marker for each location
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map,
      title: location.title,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#9B87F5',
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: '#7E69AB',
      }
    });
    
    // Add a simple info window
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-family: sans-serif; padding: 4px;">
                  <b>${location.title}</b>
                  <p style="margin: 4px 0 0; font-size: 12px;">
                    ${Math.floor(Math.random() * 20) + 5} restaurants found
                  </p>
                </div>`
    });
    
    // Show info window when marker is clicked
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  });
  
  // Return the markers array in case we need to reference them later
  return locations;
};
