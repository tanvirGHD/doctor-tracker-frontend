const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const shortFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

export const formatDate = (value) => (value ? dateFormatter.format(new Date(value)) : '-');
export const formatShortDate = (value) => (value ? shortFormatter.format(new Date(value)) : '-');

export const initials = (name = '') =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
