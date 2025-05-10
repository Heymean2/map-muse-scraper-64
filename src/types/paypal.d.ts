
// Type definitions for PayPal JavaScript SDK
interface PayPalButtonsComponentOptions {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<any>;
  onCancel?: (data: any) => void;
  onError?: (err: any) => void;
  style?: {
    layout?: string;
    color?: string;
    shape?: string;
    label?: string;
    height?: number;
  };
}

interface PayPalNamespace {
  Buttons: (options: PayPalButtonsComponentOptions) => {
    render: (container: string | HTMLElement) => void;
  };
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

export {};
