"use client";
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import i18n from "./i18n";

export function I18nProvider({ children }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Detect language from URL pathname
    const langMatch = pathname?.match(/^\/([a-z]{2})\//);
    const lang = langMatch?.[1] || "fr";

    if (lang !== i18n.language?.split("-")[0]) {
      i18n.changeLanguage(lang).then(() => setReady(true));
    } else {
      setReady(true);
    }

    document.documentElement.lang = i18n.language;
  }, [pathname]);

  if (!ready) return null;

  return <>{children}</>;
}
