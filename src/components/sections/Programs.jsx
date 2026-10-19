import Reveal from "@/components/ui/Reveal";

/** Programmes d'un domaine en blocs numérotés (01, 02...). */
export default function Programs({ programs = [], label = "Nos programmes", title }) {
  if (programs.length === 0) return null;
  return (
    <section className="py-14 md:py-20 lg:py-24">
      <div className="conteneur">
        <p className="t-label text-encre/60">{label}</p>
        {title && <Reveal className="mt-4"><h2 className="t-h2 max-w-3xl">{title}</h2></Reveal>}
        <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <li key={program.title} className="bloc-grille px-6">
              <span className="font-mono text-[13px] font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="t-h5 mt-4">{program.title}</h3>
              {program.description && <p className="texte mt-3 text-[0.95rem]">{program.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
