
// Type definitions for PayPal JavaScript SDK
// These types supplement the @paypal/react-paypal-js package types

import { PayPalScriptOptions as ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

// Extend the window interface for any custom PayPal properties we might need
declare global {
  interface Window {
    paypal?: any;
  }
}

// Custom types for our application's PayPal integration
export interface PayPalTransactionDetails {
  id: string;
  status: string;
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
}

// Extending the PayPalScriptOptions to match our usage
export interface PayPalScriptOptions extends ReactPayPalScriptOptions {
  clientId: string;
  currency?: string;
  intent?: string;
}

// Re-export types from the official package for convenience
export type { ReactPayPalScriptOptions };
