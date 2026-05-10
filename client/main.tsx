import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Signal to bots/crawlers that the page is fully rendered and ready for capture
if (typeof window !== "undefined") {
  // Give a small delay to ensure all animations/initial state settles
  setTimeout(() => {
    (window as any).prerenderReady = true;
  }, 1000);
}

