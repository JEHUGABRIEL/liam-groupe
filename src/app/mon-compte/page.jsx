import { Suspense } from "react";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata = { title: "Mon compte" };

export default function AccountPage() {
  return (
    <section className="bg-gris-clair py-12 md:py-16">
      <div className="conteneur">
        <Suspense>
          <AccountDashboard />
        </Suspense>
      </div>
    </section>
  );
}
