import { Search, X } from 'lucide-react';
import { Select } from './Field';
import Button from './Button';

// Search box + dropdowns + date range, shared by the Doctors and Patients screens.
export default function FilterBar({ search, onSearch, searchPlaceholder, selects = [], filters, onFilter, onReset, hasActiveFilters }) {
  return (
    <div className="border-b border-line p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <label htmlFor="list-search" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="list-search"
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="field-input h-10 pl-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-end">
          {selects.map((s) => (
            <Select
              key={s.key}
              aria-label={s.label}
              placeholder={s.placeholder}
              options={s.options}
              value={filters[s.key] || ''}
              onChange={(e) => onFilter(s.key, e.target.value)}
              selectClassName="h-10 lg:w-44"
            />
          ))}
          <div>
            <label htmlFor="filter-from" className="mb-1 block text-xs font-semibold text-slate-500">
              Added from
            </label>
            <input id="filter-from" type="date" value={filters.from || ''} max={filters.to || undefined} onChange={(e) => onFilter('from', e.target.value)} className="field-input h-10" />
          </div>
          <div>
            <label htmlFor="filter-to" className="mb-1 block text-xs font-semibold text-slate-500">
              Added to
            </label>
            <input id="filter-to" type="date" value={filters.to || ''} min={filters.from || undefined} onChange={(e) => onFilter('to', e.target.value)} className="field-input h-10" />
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" icon={X} onClick={onReset} className="lg:mb-0">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
