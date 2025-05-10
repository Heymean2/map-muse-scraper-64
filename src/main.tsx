
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
    intent: "capture"
  }}>
    <App />
  </PayPalScriptProvider>
);
