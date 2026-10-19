"use client";

import { Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useModals } from "@/components/providers/ModalProvider";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { api } from "@/lib/client";
import { APPLICATION_STATUS, formatDate } from "@/lib/format";

const EMPTY = {
  firstName: "", lastName: "", birthDate: "", birthPlace: "", city: "", heightCm: "",
  phone: "", educationLevel: "", occupation: "", motivation: "",
};

const PHOTOS = [
  { kind: "PORTRAIT", field: "portraitPhoto", label: "Photo portrait", hint: "Visage dégagé, fond neutre" },
  { kind: "SILHOUETTE", field: "silhouettePhoto", label: "Photo en pied", hint: "De la tête aux pieds" },
];

function PhotoUpload({ application, photo, onUpdated }) {
  const [state, setState] = useState({ status: "idle" });
  const current = application[photo.field];

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setState({ status: "loading" });
    try {
      onUpdated(await api(`/miss-centrafrique/applications/${application.id}/photos/${photo.kind}`, { method: "PUT", form }));
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: error.message });
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="border border-bordure p-4">
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-gris-clair">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={photo.label} className="h-full w-full object-cover" />
        ) : (
          <Camera aria-hidden="true" className="h-10 w-10 text-attenue" />
        )}
      </div>
      <p className="t-label-sm mt-4">{photo.label}</p>
      <p className="mt-1 text-[0.82rem] text-encre/55">{photo.hint} · JPEG, PNG ou WebP, 5 Mo max.</p>
      {application.status === "SOUMISE" && (
        <label className="btn-contour mt-4 w-full cursor-pointer px-4 py-3">
          {state.status === "loading" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          {current ? "Remplacer" : "Envoyer la photo"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload} disabled={state.status === "loading"} />
        </label>
      )}
      {state.status === "error" && <Notice type="erreur" className="mt-3">{state.message}</Notice>}
    </div>
  );
}

/** Candidature à l'édition en cours : formulaire, puis suivi et envoi des photos. */
export default function MissApplication({ edition }) {
  const { user, loading } = useAuth();
  const { openAuth } = useModals();
  const [application, setApplication] = useState(undefined);
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: "idle", errors: {} });

  const load = useCallback(async () => {
    try {
      const mine = await api("/miss-centrafrique/applications");
      setApplication(mine.find((a) => a.editionId === edition.id) || null);
    } catch {
      setApplication(null);
    }
  }, [edition.id]);

  useEffect(() => {
    if (user) {
      load();
      setForm((f) => ({ ...f, firstName: f.firstName || user.firstName || "", lastName: f.lastName || user.lastName || "", phone: f.phone || user.phone || "" }));
    }
  }, [user, load]);

  if (loading) return null;

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="texte">Pour candidater, créez votre compte ou connectez-vous : vous suivrez ensuite votre dossier en ligne.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => openAuth("inscription")} className="btn-accent">Créer mon compte</button>
          <button type="button" onClick={() => openAuth("connexion")} className="btn-contour">J&apos;ai déjà un compte</button>
        </div>
      </div>
    );
  }
  if (application === undefined) {
    return <Loader2 aria-label="Chargement" className="h-6 w-6 animate-spin text-attenue" />;
  }

  if (application) {
    return (
      <div className="space-y-8">
        <Notice type={application.status === "REFUSEE" ? "info" : "succes"}>
          Candidature {APPLICATION_STATUS[application.status].toLowerCase()} le {formatDate(application.createdAt)}.
          {!application.complete && application.status === "SOUMISE" && " Ajoutez vos deux photos pour que votre dossier soit étudié."}
        </Notice>
        <div className="grid gap-6 sm:grid-cols-2">
          {PHOTOS.map((photo) => (
            <PhotoUpload key={photo.kind} application={application} photo={photo} onUpdated={setApplication} />
          ))}
        </div>
        <p className="text-[0.88rem] text-encre/60">
          Vous pouvez suivre ou retirer votre candidature depuis <Link href="/mon-compte?onglet=candidatures" className="souligne-lien font-semibold">votre espace</Link>.
        </p>
      </div>
    );
  }

  if (!edition.registrationOpen) {
    return <Notice type="info">Les candidatures pour {edition.title} ouvriront le {formatDate(edition.registrationOpensOn)}.</Notice>;
  }

  const update = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));
  const err = (name) => state.errors?.[name];

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      const created = await api("/miss-centrafrique/applications", {
        method: "POST",
        body: { ...form, heightCm: form.heightCm ? Number(form.heightCm) : null },
      });
      setApplication(created);
      setState({ status: "idle", errors: {} });
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field label="Prénom" name="firstName" required value={form.firstName} onChange={update("firstName")} error={err("firstName")} />
      <Field label="Nom" name="lastName" required value={form.lastName} onChange={update("lastName")} error={err("lastName")} />
      <Field label="Date de naissance" name="birthDate" type="date" required value={form.birthDate} onChange={update("birthDate")} error={err("birthDate")}
        hint={edition.minAge || edition.maxAge ? `Âge requis : ${edition.minAge ?? "?"} à ${edition.maxAge ?? "?"} ans` : undefined} />
      <Field label="Lieu de naissance" name="birthPlace" value={form.birthPlace} onChange={update("birthPlace")} error={err("birthPlace")} />
      <Field label="Ville de résidence" name="city" required value={form.city} onChange={update("city")} error={err("city")} />
      <Field label="Taille (cm)" name="heightCm" type="number" min="120" max="220" value={form.heightCm} onChange={update("heightCm")} error={err("heightCm")} />
      <Field label="Téléphone" name="phone" type="tel" required value={form.phone} onChange={update("phone")} error={err("phone")} />
      <Field label="Niveau d'études" name="educationLevel" value={form.educationLevel} onChange={update("educationLevel")} error={err("educationLevel")} />
      <Field label="Profession / activité" name="occupation" className="sm:col-span-2" value={form.occupation} onChange={update("occupation")} error={err("occupation")} />
      <Field label="Pourquoi souhaitez-vous devenir Miss Centrafrique ?" name="motivation" as="textarea" required maxLength={3000} className="sm:col-span-2"
        value={form.motivation} onChange={update("motivation")} error={err("motivation")} />
      {state.status === "error" && <Notice type="erreur" className="sm:col-span-2">{state.message}</Notice>}
      <div className="sm:col-span-2">
        <button type="submit" className="btn-accent" disabled={state.status === "loading"}>
          {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          Envoyer ma candidature
        </button>
        <p className="mt-3 text-[0.85rem] text-encre/55">Vous ajouterez ensuite vos deux photos.</p>
      </div>
    </form>
  );
}
