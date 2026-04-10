/**
 * App entry point — mounts React root with providers.
 * Sets up React Query (caching), React Router, AuthProvider,
 * and loads the Google Maps Places API from env vars.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </APIProvider>
  </StrictMode>
);
