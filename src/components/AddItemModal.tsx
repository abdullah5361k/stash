import { X } from "lucide-react";
import { ItemForm } from "./ItemForm";
import type { ItemDraft } from "../types";

type AddItemModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: ItemDraft) => Promise<void> | void;
};

export function AddItemModal({ open, onClose, onSubmit }: AddItemModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end bg-stone-950/40 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-item-title"
    >
      <div className="max-h-[92vh] w-full overflow-auto rounded-t-lg border border-stone-200 bg-[#fbfaf7] p-4 shadow-soft dark:border-stone-800 dark:bg-stone-900 sm:max-w-3xl sm:rounded-lg sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="add-item-title" className="text-xl font-semibold text-stone-950 dark:text-stone-50">
              Add to Stash
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Save with title and body, then press Cmd/Ctrl+Enter.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ItemForm
          autoFocus
          submitLabel="Save item"
          onCancel={onClose}
          onSubmit={async (draft) => {
            await onSubmit(draft);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
