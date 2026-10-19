"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/admin/toast";
import { SchemaField, slugify, toForm, toRequest } from "@/components/admin/fields";
import { ActionButton, AdminPage, DataTable, Pagination, SearchInput, matchesQuery, useUrlFilter } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import Modal from "@/components/ui/Modal";
import Notice from "@/components/ui/Notice";

/**
 * Formulaire généré depuis un schéma de champs. Le slug suit le champ {@code from}
 * tant qu'il n'a pas été modifié à la main (création uniquement).
 */
export function ResourceForm({ fields, item, onSubmit, onDelete, deleteConfirm, submitLabel = "Enregistrer", children }) {
  const [form, setForm] = useState(() => toForm(fields, item));
  const [slugTouched, setSlugTouched] = useState(Boolean(item?.id));
  const [state, setState] = useState({ status: "idle", errors: {} });
  const slugField = fields.find((f) => f.type === "slug");

  function change(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (slugField && !slugTouched && name === slugField.from) next[slugField.name] = slugify(value);
      return next;
    });
    if (slugField && name === slugField.name) setSlugTouched(true);
  }

  async function submit(event) {
    event.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      await onSubmit(toRequest(fields, form));
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors || {} });
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <SchemaField key={field.name} field={field} value={form[field.name]} onChange={(v) => change(field.name, v)} error={state.errors?.[field.name]} />
        ))}
      </div>
      {children}
      {state.status === "error" && <Notice type="erreur" className="mt-6">{state.message}</Notice>}
      <div className="sticky bottom-0 -mx-6 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-bordure bg-white px-6 py-4 sm:-mx-8 sm:px-8">
        <button type="submit" className="btn-sombre" disabled={state.status === "loading"}>
          {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
        {onDelete && (
          <ActionButton action={onDelete} success="Supprimé" confirm={deleteConfirm} className="btn-contour text-accent hover:border-accent">
            Supprimer
          </ActionButton>
        )}
      </div>
    </form>
  );
}

/**
 * Écran standard du back-office : liste + panneau de création/modification.
 *
 * config : { label, title, intro, newLabel, noun (« le produit »), list: { path, paged }, columns,
 *   fields, create(body), update(item, body), remove(item), load(row) (détail complet avant
 *   édition), extra(item, close, reload) (actions propres à l'élément, sous le formulaire),
 *   expand(item) / prepare(body, item) (champs calculés ↔ structure de l'API), list.select(data) ;
 *   fields peut dépendre de l'élément : fields(item) }
 */
export default function CrudPage({ config, filters, listPath, embedded = false }) {
  const toast = useToast();
  const [q, setQ] = useUrlFilter("q");
  const basePath = listPath || config.list.path;
  // Listes paginées : recherche faite par l'API (?q=) ; listes simples : filtre local.
  const path = config.list.paged && q ? `${basePath}${basePath.includes("?") ? "&" : "?"}q=${encodeURIComponent(q)}` : basePath;
  const fetched = useResource(path, { paged: config.list.paged, select: config.list.select });
  const shownItems = config.list.paged ? fetched.items : fetched.items.filter((i) => matchesQuery(i, q, config.searchKeys));
  const resource = { ...fetched, items: shownItems, totalElements: config.list.paged ? fetched.totalElements : shownItems.length };
  const [editing, setEditing] = useState(null); // { item } ; item null = création
  const [opening, setOpening] = useState(false);

  async function open(row) {
    if (!config.load) return setEditing({ item: row });
    setOpening(true);
    try {
      setEditing({ item: await config.load(row) });
    } catch (error) {
      toast(error.message, "erreur");
    } finally {
      setOpening(false);
    }
  }

  const close = () => setEditing(null);
  const item = editing?.item;
  const fields = typeof config.fields === "function" ? config.fields(item) : config.fields;

  async function save(fields) {
    const body = config.prepare ? config.prepare(fields, item) : fields;
    if (item) await config.update(item, body);
    else await config.create(body);
    toast(item ? "Modifications enregistrées" : `${config.created || "Élément créé"}`);
    close();
    resource.reload();
  }

  const newButton = config.create && (
    <button type="button" className="btn-accent" onClick={() => setEditing({ item: null })}>
      <Plus aria-hidden="true" className="h-4 w-4" /> {config.newLabel}
    </button>
  );
  // Intégré dans un écran à onglets : pas d'en-tête propre, le bouton passe au-dessus de la liste.
  const Wrapper = embedded ? EmbeddedWrapper : AdminPage;

  return (
    <Wrapper label={config.label} title={config.title} intro={config.intro} actions={newButton}>
      <SearchInput value={q} onChange={setQ} placeholder={config.searchPlaceholder || "Rechercher…"} className="mb-6 max-w-md" />
      {filters}
      <div className={filters ? "mt-6" : ""}>
        <DataTable
          columns={config.columns}
          resource={resource}
          onOpen={opening ? undefined : open}
          empty={q ? `Aucun résultat pour « ${q} ».` : config.empty}
        />
        <Pagination page={resource.page} totalPages={resource.totalPages} totalElements={resource.totalElements} onChange={resource.setPage} />
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={close}
        panneau
        width="max-w-[760px]"
        label={item ? "Modifier" : "Nouveau"}
        title={item ? config.itemTitle(item) : config.newLabel}
      >
        {editing && (
          <>
            {item && config.extra && <div className="mb-8">{config.extra(item, { close, reload: resource.reload, setItem: (next) => setEditing({ item: next }) })}</div>}
            <ResourceForm
              key={item?.id ?? "nouveau"}
              fields={fields}
              item={item && config.expand ? config.expand(item) : item}
              onSubmit={save}
              onDelete={item && config.remove ? async () => { await config.remove(item); close(); resource.reload(); } : undefined}
              deleteConfirm={item && {
                title: `Supprimer « ${config.itemTitle(item)} » ?`,
                message: config.deleteConfirm || "L'élément disparaît du site et du back-office.",
                label: "Supprimer",
              }}
            />
          </>
        )}
      </Modal>
    </Wrapper>
  );
}

function EmbeddedWrapper({ intro, actions, children }) {
  return (
    <div>
      {(intro || actions) && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {intro && <p className="texte max-w-2xl">{intro}</p>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
