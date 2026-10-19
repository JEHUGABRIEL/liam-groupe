/** Page de texte légal : sections titrées, {{name}} / {{email}} / {{address}} remplacés par les infos du site. */
export default function LegalPage({ eyebrow, title, sections, siteInfo = {} }) {
  const fill = (text) => text
    .replaceAll("{{name}}", siteInfo.fullName || "LIAM Groupe")
    .replaceAll("{{email}}", siteInfo.emails?.[0] || "")
    .replaceAll("{{address}}", (siteInfo.address || []).join(", "));
  return (
    <>
      <section className="bloc-heros">
        <p className="t-label text-accent">{eyebrow}</p>
        <h1 className="titre-heros mt-4">{title}</h1>
      </section>
      <section className="py-14 md:py-20">
        <div className="conteneur">
          <div className="mx-auto max-w-[760px] space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="t-h5">{section.heading}</h2>
                <p className="texte mt-3">{fill(section.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
