"use client";

import { usePathname } from "next/navigation";

/**
 * En-tête, pied de page et boutons flottants du site public. Le back-office a son
 * propre habillage (cf. AdminShell) ; la page d'invitation garde celui du site.
 */
export default function SiteChrome({ header, footer, extras, children }) {
  const pathname = usePathname();
  const backOffice = pathname.startsWith("/admin") && !pathname.startsWith("/admin/invitation");
  if (backOffice) return children;
  return (
    <>
      {header}
      <main id="principal">{children}</main>
      {footer}
      {extras}
    </>
  );
}
