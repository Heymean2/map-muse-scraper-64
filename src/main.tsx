
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from './App.tsx'
import './index.css'

// Use the direct client ID or fallback to "test"
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

createRoot(document.getElementById("root")!).render(
  <PayPalScriptProvider options={{
    clientId: paypalClientId,
    components: "buttons,hosted-fields",
    currency: "USD",
    intent: "capture",
    // For hosted fields, we need to set the data-client-token
    "data-client-token": import.meta.env.VITE_PAYPAL_CLIENT_TOKEN || "sandbox_8hxpnkht_kzdtzv2btm4p7s4b"
  }}>
    <App />
  </PayPalScriptProvider>
);
