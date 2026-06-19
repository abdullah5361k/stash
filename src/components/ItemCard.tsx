import { Copy, ExternalLink, Pin, PinOff } from "lucide-react";
import { cn } from "../lib/cn";
import type { Item } from "../types";
import { typeLabels, typeStyles } from "../types";

type ItemCardProps = {
  item: Item;
  active: boolean;
  onCopy: (item: Item) => void;
  onSelect: (item: Item) => void;
  onTagClick: (tag: string) => void;
  onTogglePin: (item: Item) => void;
};

function getExcerpt(body: string) {
  const compact = body.replace(/\s+/g, " ").trim();
  return compact.length > 170 ? `${compact.slice(0, 170)}...` : compact;
}

export function ItemCard({
  item,
  active,
  onCopy,
  onSelect,
  onTagClick,
  onTogglePin,
}: ItemCardProps) {
  return (
    <article
      className={cn(
        "group rounded-lg border bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-soft dark:bg-stone-900 dark:hover:border-stone-600",
        active
          ? "border-stone-950 dark:border-stone-100"
          : "border-stone-200 dark:border-stone-800",
      )}
    >
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => onSelect(item)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-md border px-2 text-xs font-semibold",
                  typeStyles[item.type],
                )}
              >
                {typeLabels[item.type]}
              </span>
              {item.pinned ? (
                <span className="inline-flex h-6 items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  <Pin className="h-3 w-3" aria-hidden="true" />
                  Pinned
                </span>
              ) : null}
            </div>
            <h3 className="line-clamp-2 text-base font-semibold leading-6 text-stone-950 dark:text-stone-50">
              {item.title}
            </h3>
          </div>
        </div>

        <p
          className={cn(
            "mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-stone-600 dark:text-stone-300",
            item.type === "snippet" && "font-mono text-xs",
          )}
        >
          {getExcerpt(item.body)}
        </p>
      </button>

      {item.url ? (
        <a
          className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
          href={item.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{item.url}</span>
        </a>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              onClick={() => onTagClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
            onClick={() => onTogglePin(item)}
            aria-label={item.pinned ? "Unpin item" : "Pin item"}
          >
            {item.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
            onClick={() => onCopy(item)}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy
          </button>
        </div>
      </div>
    </article>
  );
}
