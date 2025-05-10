
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <PayPalScriptProvider options={{
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    components: "buttons,hosted-fields",
    currency: "USD",
    intent: "capture"
  }}>
    <App />
  </PayPalScriptProvider>
);
