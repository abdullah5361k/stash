import { Archive, Plus } from "lucide-react";

type EmptyStateProps = {
  hasItems: boolean;
  onAdd: () => void;
};

export function EmptyState({ hasItems, onAdd }: EmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300">
        <Archive className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">
        {hasItems ? "No matches" : "Save your first item"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
        {hasItems
          ? "Try a different search term, type, or tag."
          : "Capture a useful prompt, code snippet, link, or note and it will stay ready to copy."}
      </p>
      {!hasItems ? (
        <button
          type="button"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add item
        </button>
      ) : null}
    </div>
  );
}
