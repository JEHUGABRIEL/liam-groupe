"use client";

import { Camera, Loader2, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { api } from "@/lib/client";

function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({ firstName: user.firstName || "", lastName: user.lastName || "", phone: user.phone || "" });
  const [state, setState] = useState({ status: "idle", errors: {} });
  const update = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      onSaved(await api("/me", { method: "PUT", body: form }));
      setState({ status: "done", errors: {} });
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field label="Prénom" name="firstName" required value={form.firstName} onChange={update("firstName")} error={state.errors?.firstName} />
      <Field label="Nom" name="lastName" value={form.lastName} onChange={update("lastName")} error={state.errors?.lastName} />
      <Field label="E-mail" name="email" value={user.email} disabled hint="L'e-mail sert d'identifiant et ne peut pas être modifié." />
      <Field label="Téléphone" name="phone" type="tel" value={form.phone} onChange={update("phone")} error={state.errors?.phone} />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn-sombre" disabled={state.status === "loading"}>
          {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          Enregistrer
        </button>
        {state.status === "done" && <Notice type="succes">Profil mis à jour.</Notice>}
        {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
      </div>
    </form>
  );
}

function PasswordForm({ onChanged }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [state, setState] = useState({ status: "idle", errors: {} });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      await api("/me/password", { method: "PUT", body: form });
      onChanged();
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field label="Mot de passe actuel" name="currentPassword" type="password" autoComplete="current-password" required value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} error={state.errors?.currentPassword} />
      <Field label="Nouveau mot de passe" name="newPassword" type="password" autoComplete="new-password" required value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })} error={state.errors?.newPassword} hint="8 caractères minimum, une lettre et un chiffre." />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn-contour" disabled={state.status === "loading"}>Changer le mot de passe</button>
        {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
      </div>
      <p className="text-[0.85rem] text-encre/55 sm:col-span-2">Par sécurité, vous serez déconnecté·e de tous vos appareils.</p>
    </form>
  );
}

function AvatarEditor({ user, onSaved }) {
  const [state, setState] = useState({ status: "idle" });

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setState({ status: "loading" });
    try {
      onSaved(await api("/me/avatar", { method: "PUT", form }));
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: error.message });
    } finally {
      e.target.value = "";
    }
  }

  async function remove() {
    setState({ status: "loading" });
    try {
      onSaved(await api("/me/avatar", { method: "DELETE" }));
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden bg-gris-clair">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="Ma photo de profil" className="h-full w-full object-cover" />
        ) : (
          <UserRound aria-hidden="true" className="h-12 w-12 text-attenue" />
        )}
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <label className="btn-sombre cursor-pointer px-5 py-3">
            {state.status === "loading" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Camera aria-hidden="true" className="h-4 w-4" />}
            {user.avatarUrl ? "Changer la photo" : "Ajouter une photo"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload} disabled={state.status === "loading"} />
          </label>
          {user.avatarUrl && <button type="button" onClick={remove} className="btn-contour px-5 py-3">Retirer</button>}
        </div>
        <p className="text-[0.82rem] text-encre/55">JPEG, PNG ou WebP, 2 Mo maximum.</p>
        {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
      </div>
    </div>
  );
}

export default function ProfileTab() {
  const { user, setUser, logout } = useAuth();
  const [passwordChanged, setPasswordChanged] = useState(false);

  async function afterPasswordChange() {
    setPasswordChanged(true);
    await logout();
    window.location.assign("/?auth=connexion&redirect=%2Fmon-compte");
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="t-h5">Photo de profil</h2>
        <div className="mt-6"><AvatarEditor user={user} onSaved={setUser} /></div>
      </section>
      <section className="border-t border-bordure pt-10">
        <h2 className="t-h5">Mes informations</h2>
        <div className="mt-6"><ProfileForm user={user} onSaved={setUser} /></div>
      </section>
      <section className="border-t border-bordure pt-10">
        <h2 className="t-h5">Mot de passe</h2>
        <div className="mt-6">{passwordChanged ? <Notice type="succes">Mot de passe modifié, reconnexion...</Notice> : <PasswordForm onChanged={afterPasswordChange} />}</div>
      </section>
    </div>
  );
}
