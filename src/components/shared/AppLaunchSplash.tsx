"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AppLaunchSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="app-launch-splash" aria-hidden="true">
      <div className="app-launch-splash__content">
        <Image
          className="app-launch-splash__logo"
          src="/logo-attesa-2k27.png"
          alt=""
          width={1254}
          height={1254}
          priority
        />
        <p className="app-launch-splash__title">Bocce Cogoleto · 2K27</p>
      </div>
    </div>
  );
}
