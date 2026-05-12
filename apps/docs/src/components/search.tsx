import type { RouteComponent } from '@emberkit/core';
import { IconSearch } from '@emberkit/icons';

const SearchButton: RouteComponent = () => {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-400 transition-all hover:border-gray-400 hover:text-gray-800">
      <IconSearch size={16} />
      <span>Search docs...</span>
      <kbd className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs font-sans">⌘K</kbd>
    </button>
  );
};

export default SearchButton;
