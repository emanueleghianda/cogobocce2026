"use client";

import { useState } from "react";
import Image from "next/image";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className = "", compact = false }: LogoProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`logo-fallback ${compact ? "logo-fallback--compact" : ""} ${className}`} role="img" aria-label="Logo Torneo di Bocce Doppio Cogoleto 2K26">
        <span><strong>BOCCE</strong><small>COGOLETO 2K26</small></span>
      </div>
    );
  }
  return (
    <Image
      src="/logo-torneo.png"
      alt="Logo Torneo di Bocce Doppio Cogoleto 2K26"
      width={900}
      height={900}
      className={`official-logo ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
