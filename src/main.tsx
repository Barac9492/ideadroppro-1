
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";

// Initialize app cleanup utilities
import './utils/appCleanup';

// Initialize route preloading for better navigation performance
import './utils/preloader';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </React.StrictMode>,
);
