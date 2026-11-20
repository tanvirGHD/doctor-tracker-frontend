'use client';

import { useCallback, useMemo, useState } from 'react';
import useDebounce from './useDebounce';

// Holds page / search / filters for a list screen.
// Changing any filter sends the user back to page 1.
export default function useListParams(initialFilters = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const debouncedSearch = useDebounce(search);

  const updateSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setSearch('');
    setFilters(initialFilters);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const params = useMemo(
    () => ({ page, search: debouncedSearch, ...filters }),
    [page, debouncedSearch, filters]
  );

  const hasActiveFilters = Boolean(search) || Object.values(filters).some(Boolean);

  return { params, page, setPage, search, setSearch: updateSearch, filters, updateFilter, reset, hasActiveFilters };
}
