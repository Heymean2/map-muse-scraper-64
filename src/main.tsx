
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from './App.tsx'
import './index.css'

// For PayPal integration, we need a valid client ID
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

// Remove the client token from the initial script provider options
// We'll conditionally add it only when needed for hosted fields
createRoot(document.getElementById("root")!).render(
  <PayPalScriptProvider options={{
    clientId: paypalClientId,
    components: "buttons,hosted-fields",
    currency: "USD",
    intent: "capture",
  }}>
    <App />
  </PayPalScriptProvider>
);
