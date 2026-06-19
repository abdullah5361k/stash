import { Search, X } from "lucide-react";
import { itemTypes, type ItemType, typeLabels } from "../types";
import { cn } from "../lib/cn";

type Filters = {
  query: string;
  type: "all" | ItemType;
  tag: string | null;
};

type FiltersBarProps = {
  allTags: string[];
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function FiltersBar({ allTags, filters, onChange }: FiltersBarProps) {
  return (
    <section className="space-y-3">
      <label className="flex h-11 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <Search className="h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-stone-950 outline-none placeholder:text-stone-400 dark:text-stone-50"
          placeholder="Search title, body, tags..."
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
        {filters.query ? (
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-100"
            onClick={() => onChange({ ...filters, query: "" })}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </label>

      <div className="flex flex-wrap gap-2">
        {(["all", ...itemTypes] as const).map((type) => (
          <button
            key={type}
            type="button"
            className={cn(
              "h-9 rounded-md border px-3 text-sm font-medium transition",
              filters.type === type
                ? "border-stone-950 bg-stone-950 text-white dark:border-stone-50 dark:bg-stone-50 dark:text-stone-950"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800",
            )}
            onClick={() => onChange({ ...filters, type })}
          >
            {type === "all" ? "All" : typeLabels[type]}
          </button>
        ))}
      </div>

      {allTags.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filters.tag ? (
            <button
              type="button"
              className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-stone-300 bg-stone-100 px-2.5 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              onClick={() => onChange({ ...filters, tag: null })}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {filters.tag}
            </button>
          ) : null}
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn(
                "h-8 shrink-0 rounded-md border px-2.5 text-xs font-medium transition",
                filters.tag === tag
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200"
                  : "border-stone-200 bg-white text-stone-500 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-stone-100",
              )}
              onClick={() => onChange({ ...filters, tag })}
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
