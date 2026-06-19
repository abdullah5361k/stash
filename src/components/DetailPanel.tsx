import { useState } from "react";
import { Copy, ExternalLink, Pencil, Pin, PinOff, Trash2, X } from "lucide-react";
import { cn } from "../lib/cn";
import { ItemForm } from "./ItemForm";
import type { Item, ItemDraft } from "../types";
import { typeLabels, typeStyles } from "../types";

type DetailPanelProps = {
  item: Item | null;
  onClose: () => void;
  onCopy: (item: Item) => void;
  onDelete: (item: Item) => void;
  onSave: (id: string, draft: ItemDraft) => Promise<unknown> | unknown;
  onTogglePin: (item: Item) => void;
};

export function DetailPanel({
  item,
  onClose,
  onCopy,
  onDelete,
  onSave,
  onTogglePin,
}: DetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!item) {
    return (
      <aside className="hidden rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 lg:block">
        Select an item to read, edit, pin, or copy the full body.
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900 lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-auto">
      <div className="border-b border-stone-200 p-4 dark:border-stone-800">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={cn(
                "mb-2 inline-flex h-6 items-center rounded-md border px-2 text-xs font-semibold",
                typeStyles[item.type],
              )}
            >
              {typeLabels[item.type]}
            </span>
            <h2 className="break-words text-xl font-semibold leading-7 text-stone-950 dark:text-stone-50">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
            onClick={() => onCopy(item)}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy body
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            onClick={() => onTogglePin(item)}
          >
            {item.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            {item.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            onClick={() => setIsEditing((current) => !current)}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4">
        {isEditing ? (
          <ItemForm
            item={item}
            submitLabel="Update item"
            onCancel={() => setIsEditing(false)}
            onSubmit={async (draft) => {
              await onSave(item.id, draft);
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            {item.url ? (
              <a
                className="inline-flex max-w-full items-center gap-1.5 truncate text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.url}</span>
              </a>
            ) : null}

            {item.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <pre
              className={cn(
                "whitespace-pre-wrap break-words rounded-md border border-stone-200 bg-[#fbfaf7] p-4 text-sm leading-6 text-stone-800 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100",
                item.type === "snippet" && "font-mono text-xs",
              )}
            >
              {item.body}
            </pre>

            <dl className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <div>
                <dt className="font-medium uppercase tracking-wide">Created</dt>
                <dd className="mt-1">{new Date(item.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide">Updated</dt>
                <dd className="mt-1">{new Date(item.updated_at).toLocaleString()}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </aside>
  );
}
