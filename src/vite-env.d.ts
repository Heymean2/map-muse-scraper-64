
/// <reference types="vite/client" />

// Google Maps types
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setMap(map: Map | null): void;
      getCenter(): LatLng;
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getZoom(): number;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      styles?: MapTypeStyle[];
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    class OverlayView {
      setMap(map: Map | null): void;
      getPanes(): MapPanes;
      getProjection(): MapCanvasProjection;
      onAdd(): void;
      draw(): void;
      onRemove(): void;
    }
    
    interface MapPanes {
      overlayLayer: Element;
      overlayMouseTarget: Element;
      floatPane: Element;
      mapPane: Element;
    }
    
    class MapCanvasProjection {
      fromLatLngToDivPixel(latLng: LatLng): Point;
    }
    
    class Point {
      x: number;
      y: number;
      constructor(x: number, y: number);
    }
    
    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers: any[];
    }
  }
}

// Declare google on window object
interface Window {
  google: typeof google;
}
