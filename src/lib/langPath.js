import { useParams } from "next/navigation";

export function useLang() {
  const params = useParams();
  return params?.lang || "fr";
}

export function langPath(lang, path) {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}

export function useLangPath() {
  const lang = useLang();
  return (path) => langPath(lang, path);
}
