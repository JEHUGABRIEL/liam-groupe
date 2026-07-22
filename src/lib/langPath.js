

import { useParams } from "react-router-dom";


export function useLang() {
  const { lang } = useParams();
  return lang || "fr";
}


export function langPath(lang, path) {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}


export function useLangPath() {
  const lang = useLang();
  return (path) => langPath(lang, path);
}
