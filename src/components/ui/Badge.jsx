import { CONDITION_COLORS } from '@/lib/constants';

export function ConditionBadge({ condition }) {
  const color = CONDITION_COLORS[condition] || '#94a3b8';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {condition}
    </span>
  );
}

export function Avatar({ name, tone = 'brand' }) {
  const initials = name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  const tones = { brand: 'bg-brand-100 text-brand-800', slate: 'bg-slate-100 text-slate-700' };
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tones[tone]}`} aria-hidden="true">
      {initials}
    </span>
  );
}
