import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Registrazione del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrato con successo:', registration.scope);
      })
      .catch(error => {
        console.warn('Registrazione Service Worker fallita:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);