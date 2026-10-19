"use client";

import { ActionButton, AdminPage, DataTable, FilterTabs, matchesQuery, SearchInput, useUrlFilter } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

const dateTime = (value) => formatDate(value, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Conséquence d'une restauration, précisée dans la confirmation quand elle n'est pas évidente. */
const RESTORE_NOTES = {
  event: "L'événement revient tel qu'il était au moment de la suppression : s'il avait été annulé, il le reste.",
  "menu-item": "Le plat réapparaît sur la carte de son domaine (si ce domaine est lui-même en ligne).",
};

export default function Trash() {
  const [type, setType] = useUrlFilter("type");
  const [q, setQ] = useUrlFilter("q");
  // Plusieurs types partagent les mêmes id : la clé de ligne les distingue.
  const trash = useResource("/admin/trash", { select: (data) => data.map((item) => ({ ...item, id: `${item.type}-${item.id}`, entityId: item.id })) });

  const types = [...new Map(trash.items.map((i) => [i.type, i.typeLabel])).entries()];
  const items = trash.items.filter((i) => (!type || i.type === type) && matchesQuery(i, q, ["title", "detail", "typeLabel"]));

  const columns = [
    { key: "title", label: "Élément", render: (i) => <><span className="font-medium">{i.title}</span>{i.detail && <span className="block text-[0.8rem] text-encre/50">{i.detail}</span>}</> },
    { key: "type", label: "Type", className: "whitespace-nowrap", render: (i) => i.typeLabel },
    { key: "deletedAt", label: "Supprimé le", className: "whitespace-nowrap", render: (i) => dateTime(i.deletedAt) },
    {
      key: "actions", label: "", className: "text-right", render: (i) => (
        <ActionButton
          action={() => api(`/admin/trash/${i.type}/${i.entityId}/restore`, { method: "POST" })}
          success={`« ${i.title} » est de nouveau en ligne`}
          onDone={trash.reload}
          confirm={{ title: `Restaurer « ${i.title} » ?`, message: RESTORE_NOTES[i.type] || "L'élément réapparaît dans le back-office et sur le site, à son adresse d'origine.", label: "Restaurer", danger: false }}
        >
          Restaurer
        </ActionButton>
      ),
    },
  ];

  return (
    <AdminPage label="Contenu" title="Corbeille" intro="Contenu supprimé depuis le back-office : il n'apparaît plus sur le site mais reste conservé et peut être remis en ligne.">
      <SearchInput value={q} onChange={setQ} placeholder="Titre, catégorie, type…" className="mb-6 max-w-md" />
      {types.length > 1 && (
        <FilterTabs options={[{ value: "", label: "Tout" }, ...types.map(([value, label]) => ({ value, label }))]} value={type} onChange={setType} label="Type de contenu" />
      )}
      <div className="mt-6">
        <DataTable columns={columns} resource={{ ...trash, items }} empty={q ? `Aucun élément supprimé pour « ${q} ».` : "La corbeille est vide."} />
      </div>
    </AdminPage>
  );
}
