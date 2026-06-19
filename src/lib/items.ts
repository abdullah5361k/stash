import { getSupabase } from "./supabase";
import type { Item, ItemDraft } from "../types";

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function normalizeDraft(draft: ItemDraft) {
  return {
    type: draft.type,
    title: draft.title.trim(),
    body: draft.body,
    url: draft.url?.trim() || null,
    tags: normalizeTags(draft.tags),
    pinned: Boolean(draft.pinned),
  };
}

function throwIfError(message: string, error: unknown): never {
  if (error && typeof error === "object" && "message" in error) {
    throw new Error(String(error.message));
  }

  throw new Error(message);
}

export async function getItems(userId: string) {
  const { data, error } = await getSupabase()
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throwIfError("Could not load items", error);
  }

  return (data ?? []) as Item[];
}

export async function createItem(userId: string, draft: ItemDraft) {
  const { data, error } = await getSupabase()
    .from("items")
    .insert({
      ...normalizeDraft(draft),
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throwIfError("Could not create item", error);
  }

  return data as Item;
}

export async function updateItem(id: string, draft: ItemDraft) {
  const { data, error } = await getSupabase()
    .from("items")
    .update(normalizeDraft(draft))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwIfError("Could not update item", error);
  }

  return data as Item;
}

export async function deleteItem(id: string) {
  const { error } = await getSupabase().from("items").delete().eq("id", id);

  if (error) {
    throwIfError("Could not delete item", error);
  }
}

export async function setPinned(id: string, pinned: boolean) {
  const { data, error } = await getSupabase()
    .from("items")
    .update({ pinned })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwIfError("Could not update pin", error);
  }

  return data as Item;
}

export function sortItems(a: Item, b: Item) {
  if (a.pinned !== b.pinned) {
    return a.pinned ? -1 : 1;
  }

  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}
