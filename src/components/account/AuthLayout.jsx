/** Mise en page des écrans de connexion / inscription : texte à gauche, formulaire encadré à droite. */
export default function AuthLayout({ eyebrow, title, intro, children }) {
  return (
    <section className="bg-gris-clair py-14 md:py-20">
      <div className="conteneur grid gap-12 lg:grid-cols-[1fr_520px] lg:items-start">
        <div>
          <p className="flex items-center gap-1.5">
            <span aria-hidden="true" className="font-mono text-[13px] font-bold text-accent">/</span>
            <span className="sur-titre pl-[5px]">{eyebrow}</span>
          </p>
          <h1 className="titre-heros mt-3 max-w-xl">{title}</h1>
          {intro && <div className="texte mt-6 max-w-lg">{intro}</div>}
        </div>
        <div className="border border-bordure bg-white p-6 md:p-10">{children}</div>
      </div>
    </section>
  );
}
