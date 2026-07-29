import { redirect } from "next/navigation";

// Fallback pour la route racine / → /fr
// Le middleware devrait gérer cette redirection, mais en cas de défaillance
// (Next.js 16, cache, etc.), cette page assure le fonctionnement du site.
export default function RootPage() {
  redirect("/fr");
}
