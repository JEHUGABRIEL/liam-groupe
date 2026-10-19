"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";

/**
 * Charge une ressource de l'API (liste simple ou PageResponse si {@code paged}).
 * La page revient à 0 quand le chemin change (nouveau filtre). {@code select} met en forme une liste simple.
 */
export function useResource(path, { paged = false, size = 20, select } = {}) {
  const [paging, setPaging] = useState({ path, page: 0 });
  const page = paging.path === path ? paging.page : 0;
  const [state, setState] = useState({ status: "loading", data: null });

  const url = !path ? null : paged ? `${path}${path.includes("?") ? "&" : "?"}page=${page}&size=${size}` : path;

  const reload = useCallback(async () => {
    if (!url) return;
    setState((s) => ({ ...s, status: s.data ? "refreshing" : "loading" }));
    try {
      setState({ status: "ready", data: await api(url) });
    } catch (error) {
      setState({ status: "error", data: null, message: error.message });
    }
  }, [url]);

  useEffect(() => { reload(); }, [reload]);

  const data = state.data;
  const items = (paged ? data?.content : select && data ? select(data) : data) || [];
  return {
    ...state,
    items,
    page,
    totalPages: paged ? data?.totalPages ?? 0 : 1,
    totalElements: paged ? data?.totalElements ?? 0 : items.length,
    setPage: (next) => setPaging({ path, page: next }),
    reload,
  };
}
