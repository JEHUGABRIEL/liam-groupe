import { redirect } from "next/navigation";

/** Ancienne page : la connexion se fait désormais dans une modale. */
export default async function LoginPage({ searchParams }) {
  const { redirect: target } = await searchParams;
  redirect(`/?auth=connexion${target ? `&redirect=${encodeURIComponent(target)}` : ""}`);
}
