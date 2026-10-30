import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import AuthProvider from "./hooks/AuthProvider.tsx";
import "./index.css";
import { ToastProvider } from "./components/shared/ui/Toast";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
