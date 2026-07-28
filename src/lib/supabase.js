import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const missing = [];
if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (missing.length > 0) {
  throw new Error(
    `[Supabase] Variables d'environnement manquantes : ${missing.join(", ")}. ` +
    `Vérifie que le fichier .env (ou .env.local) est présent à la racine du projet ` +
    `et qu'il contient ces clés. Si le fichier existe déjà, un simple redémarrage ` +
    `du serveur de développement (npm run dev) peut suffire. ` +
    `Valeur actuelle de supabaseUrl (doit être une URL https://*.supabase.co) : ` +
    `${JSON.stringify(supabaseUrl)}.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
