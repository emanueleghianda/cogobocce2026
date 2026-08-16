"use client";

import { useState } from "react";
import Image from "next/image";

type LogoProps = {
  className?: string;
  compact?: boolean;
  src?: string;
  alt?: string;
};

export function Logo({
  className = "",
  compact = false,
  src = "/logo-singolo-2k26.png",
  alt = "Logo Torneo di Bocce Singolo Cogoleto 2K26",
}: LogoProps) {
  const [failed, setFailed] = useState(false);
  const edition = alt.toLocaleLowerCase("it").includes("doppio") ? "DOPPIO" : "SINGOLO";
  if (failed) {
    return (
      <div className={`logo-fallback ${compact ? "logo-fallback--compact" : ""} ${className}`} role="img" aria-label={alt}>
        <span><strong>BOCCE</strong><small>{edition} · COGOLETO 2K26</small></span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={900}
      height={900}
      className={`official-logo ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
