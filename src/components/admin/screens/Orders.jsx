"use client";

import { useState } from "react";
import { ActionButton, AdminPage, Badge, DataTable, Detail, FilterTabs, Pagination, useUrlFilter } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/client";
import { ORDER_STATUS, formatDate, formatPrice } from "@/lib/format";

export const ORDER_TONES = { EN_ATTENTE: "attente", CONFIRMEE: "info", PRETE: "info", LIVREE: "ok", ANNULEE: "fin" };

/** Étapes suivantes possibles (cf. OrderStatus.canBecome côté API). */
const NEXT = {
  EN_ATTENTE: [["CONFIRMEE", "Confirmer la commande"]],
  CONFIRMEE: [["PRETE", "Marquer comme prête"]],
  PRETE: [["LIVREE", "Marquer comme livrée / retirée"]],
};
const CAN_CANCEL = ["EN_ATTENTE", "CONFIRMEE", "PRETE"];

const FILTERS = [{ value: "", label: "Toutes" }, ...Object.entries(ORDER_STATUS).map(([value, label]) => ({ value, label: label.replace(" de confirmation", "") }))];

const dateTime = (value) => formatDate(value, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function OrderDetail({ order, onChanged }) {
  const setStatus = (status) => api(`/admin/orders/${order.id}/status`, { method: "PATCH", body: { status } });
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={ORDER_TONES[order.status]}>{ORDER_STATUS[order.status]}</Badge>
        <span className="text-[0.85rem] text-encre/60">Passée le {dateTime(order.createdAt)}</span>
      </div>

      <dl className="mt-6">
        <Detail label="Client">{order.customer?.fullName}</Detail>
        <Detail label="E-mail"><a href={`mailto:${order.customer?.email}`} className="souligne-lien">{order.customer?.email}</a></Detail>
        <Detail label="Téléphone">{order.phone && <a href={`tel:${order.phone}`} className="souligne-lien">{order.phone}</a>}</Detail>
        <Detail label="Mode">{order.deliveryMode === "LIVRAISON" ? "Livraison" : "Retrait sur place"}</Detail>
        <Detail label="Adresse">{order.deliveryAddress}</Detail>
        <Detail label="Note du client">{order.note}</Detail>
      </dl>

      <table className="mt-8 w-full text-[0.92rem]">
        <thead>
          <tr className="border-b border-encre/20 text-left">
            <th className="t-label-sm pb-3 text-[11px] text-encre/50">Article</th>
            <th className="t-label-sm pb-3 text-right text-[11px] text-encre/50">Qté</th>
            <th className="t-label-sm pb-3 text-right text-[11px] text-encre/50">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={`${item.source}-${item.itemId}`} className="border-b border-bordure">
              <td className="py-3">
                {item.name}
                <span className="block text-[0.8rem] text-encre/50">{item.source === "MENU" ? "Carte O'GAB" : "Boutique"} · {formatPrice(item.unitPrice)}</span>
              </td>
              <td className="py-3 text-right font-mono">{item.quantity}</td>
              <td className="py-3 text-right font-mono">{formatPrice(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="t-label-sm pt-4">Total</td>
            <td className="pt-4 text-right font-mono text-[1.05rem] font-bold">{formatPrice(order.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      {(NEXT[order.status] || CAN_CANCEL.includes(order.status)) && (
        <div className="mt-8 flex flex-wrap gap-3 border-t border-bordure pt-6">
          {(NEXT[order.status] || []).map(([status, label]) => (
            <ActionButton key={status} className="btn-sombre" action={() => setStatus(status)} success={`${order.reference} : ${ORDER_STATUS[status].toLowerCase()}`} onDone={onChanged}>
              {label}
            </ActionButton>
          ))}
          {CAN_CANCEL.includes(order.status) && (
            <ActionButton action={() => setStatus("ANNULEE")} success={`${order.reference} annulée`} onDone={onChanged} confirm="Le client sera prévenu par e-mail.">
              Annuler la commande
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [status, setStatus] = useUrlFilter();
  const orders = useResource(`/admin/orders${status ? `?status=${status}` : ""}`, { paged: true });
  const [selected, setSelected] = useState(null);

  const columns = [
    { key: "reference", label: "Référence", render: (o) => <span className="font-mono font-bold">{o.reference}</span> },
    { key: "customer", label: "Client", render: (o) => <>{o.customer?.fullName}<span className="block text-[0.8rem] text-encre/50">{o.phone}</span></> },
    { key: "items", label: "Articles", render: (o) => o.items.reduce((n, i) => n + i.quantity, 0) },
    { key: "mode", label: "Mode", render: (o) => (o.deliveryMode === "LIVRAISON" ? "Livraison" : "Retrait") },
    { key: "total", label: "Total", className: "text-right whitespace-nowrap", render: (o) => <span className="font-mono">{formatPrice(o.totalAmount)}</span> },
    { key: "date", label: "Date", className: "whitespace-nowrap", render: (o) => dateTime(o.createdAt) },
    { key: "status", label: "Statut", render: (o) => <Badge tone={ORDER_TONES[o.status]}>{ORDER_STATUS[o.status]}</Badge> },
  ];

  return (
    <AdminPage label="Activité" title="Commandes" intro="Commandes passées depuis la carte O'GAB et la boutique. Chaque changement de statut est envoyé au client par e-mail.">
      <FilterTabs options={FILTERS} value={status} onChange={setStatus} />
      <div className="mt-6">
        <DataTable columns={columns} resource={orders} onOpen={setSelected} empty="Aucune commande dans cette catégorie." />
        <Pagination page={orders.page} totalPages={orders.totalPages} totalElements={orders.totalElements} onChange={orders.setPage} />
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} panneau width="max-w-[640px]" label="Commande" title={selected?.reference}>
        {selected && <OrderDetail order={selected} onChanged={(updated) => { setSelected(updated); orders.reload(); }} />}
      </Modal>
    </AdminPage>
  );
}
