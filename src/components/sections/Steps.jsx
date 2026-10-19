import Reveal from "@/components/ui/Reveal";

/**
 * Frise d'étapes du modèle (« Quand faut-il nous appeler ? ») : 4 blocs à filet
 * gauche, numéro rouge, titre en deux temps, texte. steps : [{ title, subtitle, text }]
 */
export default function Steps({ label, title, description, steps = [], className = "bg-gris-clair" }) {
  return (
    <section className={`py-14 md:py-20 lg:py-24 ${className}`}>
      <div className="conteneur">
        <div className="max-w-3xl">
          <p className="t-label text-encre/60">{label}</p>
          <Reveal className="mt-4"><h2 className="t-h2">{title}</h2></Reveal>
          {description && <p className="texte mt-5 max-w-2xl">{description}</p>}
        </div>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="bloc-grille px-6">
              <p className="font-mono text-[13px] font-bold text-accent">{String(index + 1).padStart(2, "0")}</p>
              <p className="t-h5 mt-3">
                {step.title}
                {step.subtitle && <span className="block">· {step.subtitle}</span>}
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-encre/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
