import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js");
            console.log("Service Worker registered successfully:", registration);

            registration.addEventListener("updatefound", () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener("statechange", () => {
                        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                            console.log("New service worker available");
                        }
                    });
                }
            });
        } catch (error) {
            console.error("Service Worker registration failed:", error);
        }
    });
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
