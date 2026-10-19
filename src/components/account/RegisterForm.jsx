"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";

/** Formulaire d'inscription client (modale) ; onSwitch bascule vers la connexion. */
export default function RegisterForm({ onSuccess, onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [state, setState] = useState({ status: "idle", errors: {} });
  const update = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      await register(form);
      onSuccess?.();
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <p className="texte text-[0.95rem] sm:col-span-2">
        Un compte pour commander chez O&apos;GAB et dans la boutique, s&apos;abonner à G-Fitness, s&apos;inscrire
        aux événements et candidater à Miss Centrafrique.
      </p>
      <Field label="Prénom" name="firstName" id="inscription-prenom" autoComplete="given-name" required value={form.firstName} onChange={update("firstName")} error={state.errors?.firstName} />
      <Field label="Nom" name="lastName" id="inscription-nom" autoComplete="family-name" value={form.lastName} onChange={update("lastName")} error={state.errors?.lastName} />
      <Field label="E-mail" name="email" id="inscription-email" type="email" autoComplete="email" required className="sm:col-span-2" value={form.email} onChange={update("email")} error={state.errors?.email} />
      <Field label="Téléphone" name="phone" id="inscription-telephone" type="tel" autoComplete="tel" className="sm:col-span-2" value={form.phone} onChange={update("phone")} error={state.errors?.phone}
        hint="Pour vous joindre au sujet de vos commandes." />
      <Field label="Mot de passe" name="password" id="inscription-mot-de-passe" type="password" autoComplete="new-password" required className="sm:col-span-2" value={form.password}
        onChange={update("password")} error={state.errors?.password} hint="8 caractères minimum, avec au moins une lettre et un chiffre." />
      {state.status === "error" && <Notice type="erreur" className="sm:col-span-2">{state.message}</Notice>}
      <button type="submit" className="btn-accent w-full sm:col-span-2" disabled={state.status === "loading"}>
        {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Créer mon compte
      </button>
      <p className="border-t border-bordure pt-5 text-[0.92rem] text-encre/70 sm:col-span-2">
        Déjà inscrit·e ?{" "}
        <button type="button" onClick={onSwitch} className="souligne-lien font-semibold text-encre">Se connecter</button>
      </p>
    </form>
  );
}
