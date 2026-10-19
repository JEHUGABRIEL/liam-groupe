"use client";

import { ApplicationsTab, EventsTab, OrdersTab, SubscriptionsTab } from "./ListTabs";
import ProfileTab from "./ProfileTab";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ListSkeleton, Skeleton } from "@/components/ui/PageLoader";

const TABS = [
  { id: "profil", label: "Profil", component: ProfileTab },
  { id: "commandes", label: "Commandes", component: OrdersTab },
  { id: "abonnements", label: "Abonnements", component: SubscriptionsTab },
  { id: "evenements", label: "Événements", component: EventsTab },
  { id: "candidatures", label: "Candidatures", component: ApplicationsTab },
];

export default function AccountDashboard() {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const onglet = useSearchParams().get("onglet");
  const current = TABS.find((t) => t.id === onglet) || TABS[0];

  // Session expirée pendant la visite : retour à la connexion.
  useEffect(() => {
    if (!loading && !user) router.replace("/?auth=connexion&redirect=%2Fmon-compte");
  }, [loading, user, router]);

  // Session en cours de lecture : même mise en page, contenu remplacé par des blocs qui pulsent.
  const ready = !loading && user;

  async function signOut() {
    await logout();
    router.replace("/");
  }

  const Tab = current.component;
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="min-w-0">
        <p className="t-label text-encre/60">Bonjour</p>
        {ready ? <p className="t-h4 mt-2">{user.firstName}</p> : <Skeleton surBeige className="mt-3 h-8 w-32" />}
        <nav aria-label="Mon compte" className="mt-8 flex gap-1 overflow-x-auto border-b border-bordure lg:flex-col lg:border-b-0 lg:border-l">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={`/mon-compte?onglet=${tab.id}`}
              aria-current={tab.id === current.id ? "page" : undefined}
              className="t-label-sm whitespace-nowrap px-4 py-3 text-encre/60 transition-colors hover:text-accent aria-[current=page]:text-accent lg:-ml-px lg:border-l-2 lg:border-transparent lg:aria-[current=page]:border-accent"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        {ready && isAdmin && <Link href="/admin" className="btn-contour mt-8 w-full px-4 py-3">Back-office</Link>}
        {ready && <button type="button" onClick={signOut} className="t-label-sm souligne-lien mt-8 inline-flex items-center gap-2 text-encre/60">
          <LogOut aria-hidden="true" className="h-4 w-4" />Se déconnecter
        </button>}
      </aside>
      <div className="min-w-0 border border-bordure bg-white p-6 md:p-10">
        <h1 className="t-h3 mb-8">{current.label}</h1>
        {ready ? <Tab /> : <ListSkeleton />}
      </div>
    </div>
  );
}
