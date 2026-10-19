import Dashboard from "@/components/admin/screens/Dashboard";

// Même segment que le layout : son modèle de titre ne s'applique pas ici.
export const metadata = { title: { absolute: "Tableau de bord · Back-office LIAM" } };

export default function AdminPage() {
  return <Dashboard />;
}
