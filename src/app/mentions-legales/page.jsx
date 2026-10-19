import LegalPage from "@/components/sections/LegalPage";
import { getSiteInfo } from "@/lib/site";

export const metadata = { title: "Mentions légales" };

const SECTIONS = [
  {
    "heading": "Éditeur du site",
    "text": "Le présent site est édité par {{name}}, organisation à but non lucratif dont le siège social est situé au {{address}}. Contact : {{email}}."
  },
  {
    "heading": "Hébergement",
    "text": "Le site est hébergé par des prestataires techniques tiers (hébergement web et médias) garantissant sa disponibilité et sa sécurité."
  },
  {
    "heading": "Propriété intellectuelle",
    "text": "L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos) est la propriété de {{name}} ou de ses partenaires, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite."
  },
  {
    "heading": "Responsabilité",
    "text": "{{name}} s'efforce d'assurer l'exactitude des informations diffusées sur ce site, sans toutefois garantir qu'elles soient exemptes d'erreurs ou d'omissions."
  },
  {
    "heading": "Contact",
    "text": "Pour toute question relative aux présentes mentions légales, vous pouvez nous écrire à {{email}}."
  }
];

export default async function Page() {
  return <LegalPage eyebrow="Informations légales" title="Mentions légales" sections={SECTIONS} siteInfo={await getSiteInfo()} />;
}
