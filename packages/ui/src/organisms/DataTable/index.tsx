import type { FC } from '@emberkit/core';
import { Text, Spinner } from '../../atoms/index.js';

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => unknown;
  className?: string;
}

export interface DataTableProps<T = Record<string, unknown>> {
  [key: string]: unknown;
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const cls = `w-full overflow-x-auto ${className}`.trim();

  return (
    <div class={cls}>
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-white/10 bg-white/5">
            {columns.map((col) => {
              const thCls = [
                'px-4 py-3 text-left text-xs font-medium text-surface-800 uppercase tracking-wider',
                col.sortable ? 'cursor-pointer hover:text-surface-900 select-none' : '',
                col.className ?? '',
              ].join(' ');

              return (
                <th
                  key={col.key}
                  class={thCls}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div class="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span class="text-primary-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={columns.length} class="text-center py-12">
                <Spinner size="md" className="mx-auto" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} class="text-center py-12">
                <Text color="muted">{emptyMessage}</Text>
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                class={[
                  'transition-colors duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-primary-500/10' : 'hover:bg-surface-200',
                ].join(' ')}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} class={`px-4 py-3 text-sm text-surface-800 ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable };
