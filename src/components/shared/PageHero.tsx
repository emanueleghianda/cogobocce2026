import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";

export function PageHero({ eyebrow, title, description, children, logo = false, logoSrc, logoAlt }: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  logo?: boolean;
  logoSrc?: string;
  logoAlt?: string;
}) {
  return (
    <section className={`page-hero ${logo ? "page-hero--with-logo" : ""}`}>
      {logo && <Logo className="page-hero__logo" src={logoSrc} alt={logoAlt} />}
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-hero__description">{description}</p>}
        {children}
      </div>
    </section>
  );
}
