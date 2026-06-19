import { useEffect, useMemo, useState } from "react";
import { Download, LogOut, Moon, Plus, Sun } from "lucide-react";
import { AddItemModal } from "./components/AddItemModal";
import { AuthGate } from "./components/AuthGate";
import { DetailPanel } from "./components/DetailPanel";
import { EmptyState } from "./components/EmptyState";
import { FiltersBar } from "./components/FiltersBar";
import { ItemCard } from "./components/ItemCard";
import { useAuth } from "./hooks/useAuth";
import { useItems } from "./hooks/useItems";
import type { Item } from "./types";

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function downloadJson(items: Item[]) {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `stash-export-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const { authError, isAuthLoading, user, signIn, signOut } = useAuth();
  const {
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
  } = useItems(user?.id);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("stash-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("stash-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const itemCountLabel = useMemo(() => {
    if (items.length === 0) {
      return "No saved items";
    }

    return `${items.length} saved ${items.length === 1 ? "item" : "items"}`;
  }, [items.length]);

  async function handleCopy(item: Item) {
    await copyToClipboard(item.body);
    setToast("Copied!");
  }

  async function handleDelete(item: Item) {
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) {
      return;
    }

    await removeItem(item.id);
    setToast("Deleted");
  }

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-4 text-sm text-stone-500 dark:bg-[#181714] dark:text-stone-400">
        Loading Stash...
      </main>
    );
  }

  if (!user) {
    return <AuthGate error={authError} onSignIn={signIn} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-stone-950 transition-colors dark:bg-[#181714] dark:text-stone-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-stone-200 pb-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-normal text-stone-950 dark:text-stone-50">
              Stash
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {itemCountLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              onClick={() => downloadJson(items)}
              disabled={items.length === 0}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              onClick={() => void signOut()}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <FiltersBar allTags={allTags} filters={filters} onChange={setFilters} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0 space-y-3">
            {isLoading ? (
              <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                Loading...
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    active={selectedItem?.id === item.id}
                    onCopy={handleCopy}
                    onSelect={(nextItem) => setSelectedId(nextItem.id)}
                    onTagClick={(tag) => setFilters({ ...filters, tag })}
                    onTogglePin={(nextItem) => void togglePinned(nextItem.id, !nextItem.pinned)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState hasItems={items.length > 0} onAdd={() => setAddOpen(true)} />
            )}
          </section>

          <DetailPanel
            item={selectedItem}
            onClose={() => setSelectedId(null)}
            onCopy={handleCopy}
            onDelete={handleDelete}
            onSave={saveItem}
            onTogglePin={(item) => void togglePinned(item.id, !item.pinned)}
          />
        </div>
      </div>

      <AddItemModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={async (draft) => {
          await addItem(draft);
          setToast("Saved");
        }}
      />

      {toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow-soft dark:bg-stone-50 dark:text-stone-950">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
