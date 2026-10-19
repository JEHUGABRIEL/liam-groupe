import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import PageLoader from "@/components/ui/PageLoader";

export const metadata = {
  title: { default: "Back-office", template: "%s · Back-office LIAM" },
  robots: { index: false, follow: false },
};

export default function BackOfficeLayout({ children }) {
  return (
    <Suspense fallback={<PageLoader label="Ouverture du back-office" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
