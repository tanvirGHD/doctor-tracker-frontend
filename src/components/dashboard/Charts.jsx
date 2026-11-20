'use client';

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { CONDITION_COLORS } from '@/lib/constants';
import { formatShortDate } from '@/lib/format';

const BRAND = '#1a7c71';
const SOFT = '#7cd0c2';
const AXIS = { fontSize: 12, fill: '#64748b' };

function TooltipBox({ active, payload, label, labelFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-pop">
      <p className="mb-1 font-bold text-ink-900">{labelFormatter ? labelFormatter(label) : label}</p>
      {payload.map((item) => (
        <p key={item.dataKey || item.name} className="flex items-center gap-2 text-slate-600">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.payload?.fill }} />
          {item.name}: <span className="font-bold text-ink-900">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export function TimelineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.28} />
            <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e8eeed" />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={AXIS} tickLine={false} axisLine={false} minTickGap={32} />
        <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <Tooltip content={<TooltipBox labelFormatter={formatShortDate} />} />
        <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingBottom: 8 }} />
        <Area type="monotone" dataKey="patients" name="New patients" stroke={BRAND} strokeWidth={2.5} fill="url(#patientsFill)" />
        <Area type="monotone" dataKey="doctors" name="New doctors" stroke="#e7a02f" strokeWidth={2} fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PatientsPerDoctorChart({ data }) {
  const rows = data.map((d) => ({ ...d, short: d.name.replace(/^Dr\.?\s+/i, '') }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 38)}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="#e8eeed" />
        <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="short" width={118} tick={AXIS} tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: '#f1f5f4' }} content={<TooltipBox />} />
        <Bar dataKey="count" name="Patients" fill={BRAND} radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConditionsChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none">
              {data.map((entry) => (
                <Cell key={entry.name} fill={CONDITION_COLORS[entry.name] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-ink-900">{total}</span>
          <span className="text-xs text-slate-500">patients</span>
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CONDITION_COLORS[entry.name] || '#94a3b8' }} />
              {entry.name}
            </span>
            <span className="font-bold tabular-nums text-ink-900">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecializationChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e8eeed" />
        <XAxis dataKey="name" tick={AXIS} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={64} />
        <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: '#f1f5f4' }} content={<TooltipBox />} />
        <Bar dataKey="count" name="Doctors" fill={SOFT} radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
