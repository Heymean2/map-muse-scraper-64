
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
      addControl(control: any, position?: ControlPosition): void;
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

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | null;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setIcon(icon: string | Icon | Symbol): void;
      setTitle(title: string): void;
      setLabel(label: string | MarkerLabel): void;
      setDraggable(draggable: boolean): void;
      setVisible(visible: boolean): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }
    
    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      draggable?: boolean;
      clickable?: boolean;
      animation?: Animation;
      visible?: boolean;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }
    
    interface Icon {
      url?: string;
      scaledSize?: Size;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      labelOrigin?: Point;
      path?: string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeWeight?: number;
      strokeColor?: string;
    }
    
    interface Symbol {
      path: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
    }

    enum SymbolPath {
      CIRCLE,
      BACKWARD_CLOSED_ARROW,
      FORWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      FORWARD_OPEN_ARROW
    }
    
    enum Animation {
      BOUNCE,
      DROP
    }
    
    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker | null): void;
      close(): void;
      setContent(content: string | Node): void;
      getPosition(): LatLng | null;
      setPosition(position: LatLng | LatLngLiteral): void;
    }
    
    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
      pixelOffset?: Size;
    }

    type ControlPosition = number;
    
    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
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

    interface MapsEventListener {
      remove(): void;
    }

    namespace event {
      function addListener(instance: object, eventName: string, handler: Function): MapsEventListener;
      function addDomListener(instance: Element, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
      function clearInstanceListeners(instance: object): void;
    }
  }
}

// Declare google on window object
interface Window {
  google: typeof google;
}
