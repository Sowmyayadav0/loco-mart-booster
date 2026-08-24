import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;
  pageCount: number;
  total: number;
  onChange: (page: number) => void;
}

export function PaginationBar({ page, pageCount, total, onChange }: PaginationBarProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border px-5 py-3 sm:flex sm:justify-between">
      <p className="min-w-0 truncate text-xs text-muted-foreground">
        Page {page} of {pageCount} · {total} results
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="grid h-8 w-8 place-items-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-colors",
              page === i + 1
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-muted",
            )}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="grid h-8 w-8 place-items-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
