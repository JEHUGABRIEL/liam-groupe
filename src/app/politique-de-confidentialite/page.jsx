import LegalPage from "@/components/sections/LegalPage";
import { getSiteInfo } from "@/lib/site";

export const metadata = { title: "Politique de confidentialité" };

const SECTIONS = [
  {
    "heading": "Données collectées",
    "text": "Nous collectons uniquement les informations que vous nous transmettez volontairement via nos formulaires de contact, d'inscription ou de newsletter (nom, email, téléphone, message)."
  },
  {
    "heading": "Utilisation des données",
    "text": "Ces informations sont utilisées exclusivement pour répondre à vos demandes, gérer les inscriptions à nos événements et vous informer de nos actualités si vous y avez consenti."
  },
  {
    "heading": "Partage des données",
    "text": "Vos données ne sont ni vendues ni cédées à des tiers. Elles peuvent être partagées avec nos prestataires techniques (hébergement, messagerie) dans le seul but d'assurer le bon fonctionnement du site."
  },
  {
    "heading": "Vos droits",
    "text": "Conformément aux principes de protection des données personnelles, vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données en nous écrivant à {{email}}."
  },
  {
    "heading": "Cookies",
    "text": "Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement : votre session de connexion (jetons sécurisés, inaccessibles aux scripts) et le contenu de votre panier, conservé dans votre navigateur."
  }
];

export default async function Page() {
  return <LegalPage eyebrow="Vos données" title="Politique de confidentialité" sections={SECTIONS} siteInfo={await getSiteInfo()} />;
}
