"use client";

import { ArrowUp, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import SafeImg from "@/components/ui/SafeImg";
import { api } from "@/lib/client";

/*
 * Champs du back-office décrits par un schéma :
 *   { name, label, type, required, hint, span: "full", folder (images), options (select), from (slug),
 *     suggestions (valeurs proposées d'un champ texte) }
 * Types : text, slug, textarea, number, price, date, checkbox, select, image, gallery, list, tags,
 * programs, social, repeater (lignes de sous-champs { name, label, type: text|image, options }, cf. {@code item}).
 * toForm / toRequest font la conversion entre l'API et les champs.
 */

const SOCIAL_KEYS = [["facebook", "Facebook"], ["instagram", "Instagram"], ["linkedin", "LinkedIn"], ["x", "X (Twitter)"]];

/** « Fête de la musique 2026 » → « fete-de-la-musique-2026 ». */
export function slugify(text) {
  return (text || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}

/** Valeur de l'API → valeur du champ. */
export function toForm(fields, item = {}) {
  const form = {};
  for (const f of fields) {
    const v = item?.[f.name];
    switch (f.type) {
      case "list": form[f.name] = (v || []).join("\n"); break;
      case "tags": form[f.name] = (v || []).join(", "); break;
      case "number": case "price": form[f.name] = v === null || v === undefined ? "" : String(v); break;
      case "checkbox": form[f.name] = v ?? f.default ?? false; break;
      case "gallery": form[f.name] = v || []; break;
      case "programs": form[f.name] = (v || []).map((p) => ({ title: p.title || "", description: p.description || "" })); break;
      case "social": form[f.name] = { ...(v || {}) }; break;
      case "repeater": form[f.name] = (v || []).map((row) => Object.fromEntries(f.item.map((sub) => [sub.name, row[sub.name] ?? ""]))); break;
      default: form[f.name] = v ?? f.default ?? "";
    }
  }
  return form;
}

/** Valeurs des champs → corps de la requête (vide → null, listes découpées). */
export function toRequest(fields, form) {
  const body = {};
  for (const f of fields) {
    if (f.readOnly) continue;
    const v = form[f.name];
    switch (f.type) {
      case "list": body[f.name] = v.split("\n").map((s) => s.trim()).filter(Boolean); break;
      case "tags": body[f.name] = v.split(",").map((s) => s.trim()).filter(Boolean); break;
      case "number": case "price": body[f.name] = v === "" ? null : Number(String(v).replace(/\s/g, "")); break;
      case "checkbox": body[f.name] = Boolean(v); break;
      case "gallery": body[f.name] = v; break;
      case "programs": body[f.name] = v.filter((p) => p.title.trim()).map((p) => ({ title: p.title.trim(), description: p.description.trim() || null })); break;
      case "social": body[f.name] = Object.fromEntries(Object.entries(v).filter(([, url]) => url?.trim())); break;
      case "repeater": body[f.name] = v
        .map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])))
        .filter((row) => row[f.item[0].name]); break;
      default: body[f.name] = typeof v === "string" ? (v.trim() || null) : v;
    }
  }
  return body;
}

async function uploadImage(file, folder) {
  const form = new FormData();
  form.append("file", file);
  const { url } = await api(`/admin/media?folder=${folder}`, { method: "POST", form });
  return url;
}

function UploadButton({ folder, onUploaded, multiple = false, label = "Envoyer une image" }) {
  const input = useRef(null);
  const [state, setState] = useState({ status: "idle" });

  async function change(event) {
    const files = [...event.target.files];
    event.target.value = "";
    if (!files.length) return;
    setState({ status: "loading" });
    try {
      for (const file of files) onUploaded(await uploadImage(file, folder));
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  }

  return (
    <div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={change} className="sr-only" tabIndex={-1} aria-hidden="true" />
      <button type="button" onClick={() => input.current?.click()} disabled={state.status === "loading"} className="btn-contour px-4 py-2.5">
        {state.status === "loading" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="h-4 w-4" />}
        {label}
      </button>
      {state.status === "error" && <p className="mt-1.5 text-[0.82rem] text-accent">{state.message}</p>}
    </div>
  );
}

function ImageInput({ id, field, value, onChange }) {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="h-24 w-32 shrink-0 overflow-hidden border border-bordure bg-gris-clair">
        {value && <SafeImg key={value} src={value} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-[200px] flex-1 space-y-3">
        <UploadButton folder={field.folder} onUploaded={onChange} />
        <input id={id} className="champ py-2 text-[0.85rem]" value={value} placeholder="ou collez l'adresse d'une image" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function GalleryInput({ field, value, onChange }) {
  const move = (i) => { const next = [...value]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next); };
  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="group relative aspect-[4/3] overflow-hidden border border-bordure bg-gris-clair">
              <SafeImg src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute right-1 top-1 flex gap-1">
                {i > 0 && (
                  <button type="button" onClick={() => move(i)} aria-label="Avancer" className="bg-white/90 p-1 hover:bg-white">
                    <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                )}
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Retirer" className="bg-white/90 p-1 hover:bg-accent hover:text-white">
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <UploadButton folder={field.folder} multiple label="Ajouter des photos" onUploaded={(url) => onChange((list) => [...list, url])} />
    </div>
  );
}

function ProgramsInput({ value, onChange }) {
  const set = (i, key) => (e) => onChange(value.map((p, j) => (j === i ? { ...p, [key]: e.target.value } : p)));
  return (
    <div className="space-y-3">
      {value.map((program, i) => (
        <div key={i} className="relative border border-bordure p-4 pr-12">
          <input className="champ py-2" placeholder="Titre" aria-label={`Titre du programme ${i + 1}`} value={program.title} onChange={set(i, "title")} />
          <textarea className="champ mt-2 min-h-[70px] py-2 text-[0.9rem]" placeholder="Description" aria-label={`Description du programme ${i + 1}`} value={program.description} onChange={set(i, "description")} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Retirer ce programme" className="absolute right-3 top-3 p-1 text-encre/50 hover:text-accent">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { title: "", description: "" }])} className="btn-contour px-4 py-2.5">
        <Plus aria-hidden="true" className="h-4 w-4" /> Ajouter un programme
      </button>
    </div>
  );
}

function RepeaterInput({ field, value, onChange }) {
  const set = (i, key) => (v) => onChange(value.map((row, j) => (j === i ? { ...row, [key]: v } : row)));
  const empty = Object.fromEntries(field.item.map((sub) => [sub.name, ""]));
  const texts = field.item.filter((sub) => sub.type !== "image");
  const image = field.item.find((sub) => sub.type === "image");
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-start gap-2 border border-bordure p-2">
          {image && (
            <div className="w-[150px] shrink-0">
              <div className="aspect-square overflow-hidden bg-gris-clair">{row[image.name] && <SafeImg key={row[image.name]} src={row[image.name]} alt="" className="h-full w-full object-cover" />}</div>
              <div className="mt-2"><UploadButton folder={field.folder} label="Photo" onUploaded={set(i, image.name)} /></div>
            </div>
          )}
          <div className={`grid flex-1 gap-2 ${image ? "" : "sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"}`}>
            {texts.map((sub) => sub.options ? (
              <select key={sub.name} className="champ py-2 text-[0.9rem]" aria-label={`${sub.label} (${i + 1})`} value={row[sub.name]} onChange={(e) => set(i, sub.name)(e.target.value)}>
                <option value="">{sub.label}</option>
                {sub.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input key={sub.name} className="champ py-2 text-[0.9rem]" placeholder={sub.label} aria-label={`${sub.label} (${i + 1})`} value={row[sub.name]} onChange={(e) => set(i, sub.name)(e.target.value)} />
            ))}
          </div>
          <div className={`flex shrink-0 ${image ? "flex-col" : "items-center self-center"}`}>
            {i > 0 && (
              <button type="button" onClick={() => { const next = [...value]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next); }} aria-label="Monter" className="p-2 text-encre/50 hover:text-encre">
                <ArrowUp aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Retirer" className="p-2 text-encre/50 hover:text-accent">
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, empty])} className="btn-contour px-4 py-2.5">
        <Plus aria-hidden="true" className="h-4 w-4" /> {field.addLabel || "Ajouter une ligne"}
      </button>
    </div>
  );
}

function SocialInput({ keys = SOCIAL_KEYS, value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keys.map(([key, label]) => (
        <input key={key} className="champ py-2 text-[0.9rem]" placeholder={label} aria-label={label} value={value[key] || ""} onChange={(e) => onChange({ ...value, [key]: e.target.value })} />
      ))}
    </div>
  );
}

/** Un champ du schéma, avec son étiquette et l'erreur renvoyée par l'API. */
export function SchemaField({ field, value, onChange, error }) {
  const id = `${useId()}-${field.name}`;
  const common = {
    id,
    "aria-invalid": Boolean(error),
    className: `champ ${error ? "champ-erreur" : ""}`,
    required: field.required,
    disabled: field.readOnly,
    placeholder: field.placeholder,
  };
  // Les galeries reçoivent aussi des mises à jour fonctionnelles (plusieurs envois à la suite).
  const set = (next) => onChange(typeof next === "function" ? next(value) : next);

  let input;
  switch (field.type) {
    case "textarea":
      input = <textarea {...common} rows={field.rows || 5} className={`${common.className} min-h-[110px]`} value={value} onChange={(e) => set(e.target.value)} />;
      break;
    case "list":
      input = <textarea {...common} rows={field.rows || 4} className={`${common.className} min-h-[100px]`} value={value} onChange={(e) => set(e.target.value)} />;
      break;
    case "number": case "price":
      input = (
        <div className="relative">
          <input {...common} inputMode="numeric" value={value} onChange={(e) => set(e.target.value.replace(/[^\d]/g, ""))} />
          {field.type === "price" && <span className="t-label-sm pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-encre/40">FCFA</span>}
        </div>
      );
      break;
    case "date":
      input = <input {...common} type="date" value={value} onChange={(e) => set(e.target.value)} />;
      break;
    case "select":
      input = (
        <select {...common} value={value} onChange={(e) => set(e.target.value)}>
          {!field.required && <option value="">—</option>}
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case "checkbox":
      return (
        <label className={`flex cursor-pointer items-start gap-3 ${field.span === "full" ? "sm:col-span-2" : ""}`}>
          <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="mt-1 h-4 w-4 accent-accent" />
          <span>
            <span className="font-medium">{field.label}</span>
            {field.hint && <span className="block text-[0.82rem] text-encre/55">{field.hint}</span>}
          </span>
        </label>
      );
    case "image":
      input = <ImageInput id={id} field={field} value={value} onChange={set} />;
      break;
    case "gallery":
      input = <GalleryInput field={field} value={value} onChange={set} />;
      break;
    case "programs":
      input = <ProgramsInput value={value} onChange={set} />;
      break;
    case "social":
      input = <SocialInput keys={field.keys} value={value} onChange={set} />;
      break;
    case "repeater":
      input = <RepeaterInput field={field} value={value} onChange={set} />;
      break;
    default:
      input = (
        <>
          <input {...common} list={field.suggestions ? `${id}-choix` : undefined} value={value} onChange={(e) => set(e.target.value)} />
          {field.suggestions && <datalist id={`${id}-choix`}>{field.suggestions.map((v) => <option key={v} value={v} />)}</datalist>}
        </>
      );
  }

  const full = field.span === "full" || ["textarea", "list", "image", "gallery", "programs", "social", "repeater"].includes(field.type);
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="etiquette">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </label>
      {input}
      {field.hint && !error && <p className="mt-1.5 text-[0.82rem] text-encre/55">{field.hint}</p>}
      {error && <p className="mt-1.5 text-[0.82rem] text-accent">{error}</p>}
    </div>
  );
}
