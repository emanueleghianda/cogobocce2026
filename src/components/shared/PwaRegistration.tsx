"use client";

import { useEffect } from "react";

interface WindowWithInstallPrompt extends Window {
  __bocceInstallPrompt?: Event;
}

export function PwaRegistration() {
  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      (window as WindowWithInstallPrompt).__bocceInstallPrompt = event;
      window.dispatchEvent(new Event("bocceinstallpromptready"));
    };
    const onInstalled = () => {
      delete (window as WindowWithInstallPrompt).__bocceInstallPrompt;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (!("serviceWorker" in navigator)) {
      return () => {
        window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js?v=4", { updateViaCache: "none" }).then((registration) => {
        void registration.update();
      }).catch(() => {
        // Il sito continua a funzionare normalmente anche se la registrazione non riesce.
      });
    };

    if (document.readyState === "complete") {
      register();
      return () => {
        window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    window.addEventListener("load", register, { once: true });
    return () => {
      window.removeEventListener("load", register);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return null;
}
