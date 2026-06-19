export type ItemType = "prompt" | "link" | "note" | "snippet";

export type Item = {
  id: string;
  user_id: string;
  type: ItemType;
  title: string;
  body: string;
  url?: string;
  tags: string[];
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type ItemDraft = {
  type: ItemType;
  title: string;
  body: string;
  url?: string;
  tags: string[];
  pinned?: boolean;
};

export const itemTypes: ItemType[] = ["prompt", "link", "note", "snippet"];

export const typeLabels: Record<ItemType, string> = {
  prompt: "Prompt",
  link: "Link",
  note: "Note",
  snippet: "Snippet",
};

export const typeStyles: Record<ItemType, string> = {
  prompt: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200",
  link: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  note: "border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-500/30 dark:bg-stone-500/10 dark:text-stone-200",
  snippet: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
};
