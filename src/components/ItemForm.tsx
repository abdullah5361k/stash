import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { Check, Link as LinkIcon, Tag } from "lucide-react";
import { itemTypes, type Item, type ItemDraft, type ItemType, typeLabels } from "../types";
import { cn } from "../lib/cn";

const emptyDraft: ItemDraft = {
  type: "note",
  title: "",
  body: "",
  url: "",
  tags: [],
  pinned: false,
};

function draftFromItem(item?: Item | null): ItemDraft {
  if (!item) {
    return emptyDraft;
  }

  return {
    type: item.type,
    title: item.title,
    body: item.body,
    url: item.url ?? "",
    tags: item.tags,
    pinned: item.pinned,
  };
}

type ItemFormProps = {
  item?: Item | null;
  submitLabel?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  onSubmit: (draft: ItemDraft) => Promise<void> | void;
};

export function ItemForm({
  item,
  submitLabel = "Save",
  autoFocus = false,
  onCancel,
  onSubmit,
}: ItemFormProps) {
  const [draft, setDraft] = useState<ItemDraft>(() => draftFromItem(item));
  const [tagsInput, setTagsInput] = useState(() => draftFromItem(item).tags.join(", "));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const nextDraft = draftFromItem(item);
    setDraft(nextDraft);
    setTagsInput(nextDraft.tags.join(", "));
  }, [item]);

  const isValid = draft.title.trim().length > 0 && draft.body.trim().length > 0;

  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (!isValid || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        ...draft,
        title: draft.title.trim(),
        body: draft.body,
        url: draft.url?.trim() || undefined,
        tags: tagsInput.split(","),
      });

      if (!item) {
        setDraft(emptyDraft);
        setTagsInput("");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleShortcut(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} onKeyDown={handleShortcut}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Title
          </span>
          <input
            autoFocus={autoFocus}
            className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-950 shadow-sm transition focus:border-blue-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-50"
            placeholder="Reusable onboarding prompt"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Type
          </span>
          <select
            className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-950 shadow-sm transition focus:border-blue-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-50"
            value={draft.type}
            onChange={(event) =>
              setDraft((current) => ({ ...current, type: event.target.value as ItemType }))
            }
          >
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          Body
        </span>
        <textarea
          className={cn(
            "min-h-52 w-full resize-y rounded-md border border-stone-200 bg-white p-3 text-sm leading-6 text-stone-950 shadow-sm transition focus:border-blue-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-50",
            draft.type === "snippet" && "font-mono",
          )}
          placeholder="Paste the prompt, note, or code you want to reuse."
          value={draft.body}
          onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Source URL
          </span>
          <span className="flex h-11 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 shadow-sm dark:border-stone-700 dark:bg-stone-950">
            <LinkIcon className="h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-950 outline-none placeholder:text-stone-400 dark:text-stone-50"
              placeholder="https://..."
              value={draft.url ?? ""}
              onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))}
            />
          </span>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Tags
          </span>
          <span className="flex h-11 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 shadow-sm dark:border-stone-700 dark:bg-stone-950">
            <Tag className="h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-950 outline-none placeholder:text-stone-400 dark:text-stone-50"
              placeholder="ai, react, writing"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
            />
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-stone-300 text-blue-600"
            checked={Boolean(draft.pinned)}
            onChange={(event) =>
              setDraft((current) => ({ ...current, pinned: event.target.checked }))
            }
          />
          Keep pinned
        </label>

        <div className="flex items-center justify-end gap-2">
          {onCancel ? (
            <button
              type="button"
              className="h-10 rounded-md border border-stone-200 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              onClick={onCancel}
            >
              Cancel
            </button>
          ) : null}
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
            disabled={!isValid || isSaving}
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {isSaving ? "Saving" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
