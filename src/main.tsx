
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from './App.tsx'
import './index.css'

// For PayPal integration, we need a valid client ID
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

createRoot(document.getElementById("root")!).render(
  <PayPalScriptProvider options={{
    clientId: paypalClientId,
    components: "buttons",
    currency: "USD",
    intent: "capture",
    "enable-funding": "card,paylater"
  }}>
    <App />
  </PayPalScriptProvider>
);
