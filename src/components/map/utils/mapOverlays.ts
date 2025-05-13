
/**
 * CustomMarkerOverlay factory - Creates a custom overlay class for Google Maps
 */
export const createCustomMarkerOverlay = () => {
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
