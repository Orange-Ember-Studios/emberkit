import type { RouteComponent } from '@emberkit/core';
import { IconSearch } from './icons';

const SearchButton: RouteComponent = () => {
  return (
    <button className="search-button">
      <IconSearch size={16} />
      <span>Search docs...</span>
      <kbd>⌘K</kbd>
    </button>
  );
};

export default SearchButton;