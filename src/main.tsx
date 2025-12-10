import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const API_BASE = (import.meta as any).env.VITE_API_BASE_URL;
const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "";
console.log("Google Client ID:", clientId);
// or whatever you attached, or:
console.log("API_BASE:", API_BASE);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
