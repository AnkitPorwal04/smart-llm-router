import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ToastProvider } from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";

// Dismiss splash screen after React mounts (minimum 1.2s visible)
const splashStart = performance.now();
function dismissSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  const elapsed = performance.now() - splashStart;
  const remaining = Math.max(0, 1200 - elapsed);
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 500);
  }, remaining);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

dismissSplash();
