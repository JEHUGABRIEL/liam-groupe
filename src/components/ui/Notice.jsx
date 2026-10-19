import { CheckCircle2, CircleAlert, Info } from "lucide-react";

const STYLES = {
  succes: { icon: CheckCircle2, className: "border-emerald-600/30 bg-emerald-50 text-emerald-900" },
  erreur: { icon: CircleAlert, className: "border-accent/30 bg-accent-pale text-accent-sombre" },
  info: { icon: Info, className: "border-bordure bg-gris-clair text-encre" },
};

/** Message en ligne (succès, erreur, information). */
export default function Notice({ type = "info", children, className = "" }) {
  if (!children) return null;
  const { icon: Icon, className: style } = STYLES[type];
  return (
    <div role={type === "erreur" ? "alert" : "status"} className={`flex items-start gap-3 border px-4 py-3 text-[0.92rem] ${style} ${className}`}>
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
