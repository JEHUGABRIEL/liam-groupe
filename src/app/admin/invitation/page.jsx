import { Suspense } from "react";
import AcceptInvitation from "@/components/account/AcceptInvitation";
import AuthLayout from "@/components/account/AuthLayout";

export const metadata = { title: "Invitation", robots: { index: false } };

export default function InvitationPage() {
  return (
    <AuthLayout eyebrow="Back-office" title="Bienvenue dans l'équipe." intro="Un administrateur vous a invité·e à gérer le site de LIAM Groupe. Choisissez votre mot de passe pour activer votre compte.">
      <Suspense>
        <AcceptInvitation />
      </Suspense>
    </AuthLayout>
  );
}
