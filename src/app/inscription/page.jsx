import { redirect } from "next/navigation";

/** Ancienne page : l'inscription se fait désormais dans une modale. */
export default async function RegisterPage({ searchParams }) {
  const { redirect: target } = await searchParams;
  redirect(`/?auth=inscription${target ? `&redirect=${encodeURIComponent(target)}` : ""}`);
}
