import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bloc-heros min-h-[60vh] justify-center">
      <p className="t-label text-accent">Erreur 404</p>
      <h1 className="titre-heros mt-4">Cette page n&apos;existe pas.</h1>
      <p className="texte mt-5 max-w-xl">Elle a peut-être été déplacée lors de la refonte du site.</p>
      <Link href="/" className="btn-sombre mt-8 self-start">Retour à l&apos;accueil</Link>
    </section>
  );
}
