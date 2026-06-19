import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createItem,
  deleteItem,
  getItems,
  setPinned,
  sortItems,
  updateItem,
} from "../lib/items";
import type { Item, ItemDraft, ItemType } from "../types";

type Filters = {
  query: string;
  type: "all" | ItemType;
  tag: string | null;
};

const defaultFilters: Filters = {
  query: "",
  type: "all",
  tag: null,
};

function matchesSearch(item: Item, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return [item.title, item.body, item.url ?? "", ...item.tags]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function useItems(userId: string | null | undefined) {
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setSelectedId(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const storedItems = await getItems(userId);
      setItems(storedItems);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load items");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(async (draft: ItemDraft) => {
    if (!userId) {
      throw new Error("You must be signed in to save items.");
    }

    const item = await createItem(userId, draft);
    setItems((current) => [item, ...current].sort(sortItems));
    setSelectedId(item.id);
    return item;
  }, [userId]);

  const saveItem = useCallback(async (id: string, draft: ItemDraft) => {
    const updated = await updateItem(id, draft);
    setItems((current) =>
      current.map((item) => (item.id === id ? updated : item)).sort(sortItems),
    );
    return updated;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await deleteItem(id);
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const togglePinned = useCallback(async (id: string, pinned: boolean) => {
    const updated = await setPinned(id, pinned);
    setItems((current) =>
      current.map((item) => (item.id === id ? updated : item)).sort(sortItems),
    );
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.tags))).sort(),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const typeMatches = filters.type === "all" || item.type === filters.type;
        const tagMatches = !filters.tag || item.tags.includes(filters.tag);
        return typeMatches && tagMatches && matchesSearch(item, filters.query);
      }),
    [filters, items],
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  return {
    allTags,
    error,
    filteredItems,
    filters,
    isLoading,
    items,
    selectedItem,
    addItem,
    removeItem,
    saveItem,
    setFilters,
    setSelectedId,
    togglePinned,
  };
}
