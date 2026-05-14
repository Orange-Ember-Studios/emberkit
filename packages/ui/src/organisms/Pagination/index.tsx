import type { FC } from "@emberkit/core";
import { Button } from "../../atoms/index.js";

export interface PaginationProps {
  [key: string]: unknown;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const cls = `flex items-center justify-center gap-2 ${className}`.trim();

  function getPages(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  return (
    <nav class={cls} aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <div class="flex items-center gap-1">
        {getPages().map((page, i) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${i}`} class="px-2 text-surface-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              class={[
                "min-w-[2.25rem] h-9 rounded-lg text-sm font-medium transition-colors duration-150",
                page === currentPage
                  ? "bg-primary-500 text-white"
                  : "text-surface-600 hover:bg-surface-200",
              ].join(" ")}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
};

export { Pagination };
