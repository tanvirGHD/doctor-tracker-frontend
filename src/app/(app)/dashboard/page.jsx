'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import PageHeader from '@/components/ui/PageHeader';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState, { ErrorState } from '@/components/ui/EmptyState';
import { Avatar, ConditionBadge } from '@/components/ui/Badge';
import { ConditionsChart, PatientsPerDoctorChart, SpecializationChart, TimelineChart } from '@/components/dashboard/Charts';
import { useDashboard } from '@/hooks/queries';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/format';

const RANGES = [7, 30, 90];

function Panel({ title, subtitle, children, className }) {
  return (
    <section className={clsx('panel p-5', className)}>
      <h2 className="text-base font-extrabold">{title}</h2>
      {subtitle && <p className="mb-4 mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Stat({ label, value, note }) {
  return (
    <div className="bg-white px-5 py-4 sm:py-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-4xl font-extrabold tabular-nums tracking-tight text-ink-900">{value}</p>
      {note && <p className="mt-1 text-xs font-semibold text-brand-700">{note}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [days, setDays] = useState(30);
  const { data, isLoading, isError, error, refetch, isPlaceholderData } = useDashboard(days);

  const range = (
    <div role="group" aria-label="Date range" className="inline-flex rounded-lg border border-line bg-white p-1">
      {RANGES.map((value) => (
        <button
          key={value}
          onClick={() => setDays(value)}
          aria-pressed={days === value}
          className={clsx(
            'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
            days === value ? 'bg-ink-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          {value} days
        </button>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] || ''}`} description="Here is how your doctors and patients are doing." action={range} />

      {isError ? (
        <div className="panel"><ErrorState error={error} onRetry={refetch} /></div>
      ) : isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 lg:col-span-2" />
            <Skeleton className="h-80" />
          </div>
        </div>
      ) : data.totals.doctors === 0 ? (
        <div className="panel">
          <EmptyState
            title="Nothing to chart yet"
            message="Add a doctor and a few patients and your dashboard will fill in."
            action={<Link href="/doctors" className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">Add your first doctor</Link>}
          />
        </div>
      ) : (
        <div className={clsx('space-y-6 transition-opacity', isPlaceholderData && 'opacity-60')}>
          <section className="panel grid grid-cols-2 gap-px overflow-hidden bg-line sm:grid-cols-4">
            <Stat label="Total doctors" value={data.totals.doctors} note={`+${data.totals.newDoctors} in ${days} days`} />
            <Stat label="Total patients" value={data.totals.patients} note={`+${data.totals.newPatients} in ${days} days`} />
            <Stat label="Patients per doctor" value={data.totals.avgPatientsPerDoctor} note="Average" />
            <Stat label={`New patients, ${days} days`} value={data.totals.newPatients} note={`${(data.totals.newPatients / days).toFixed(1)} per day`} />
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="New patients and doctors" subtitle={`Added each day over the last ${days} days`} className="lg:col-span-2">
              <TimelineChart data={data.timeline} />
            </Panel>
            <Panel title="Patients by condition" subtitle="All patients">
              <ConditionsChart data={data.conditions} />
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Patients per doctor" subtitle="Doctors with the most patients">
              <PatientsPerDoctorChart data={data.patientsPerDoctor} />
            </Panel>
            <Panel title="Doctors by specialization" subtitle="How your doctors are spread">
              <SpecializationChart data={data.specializations} />
            </Panel>
          </div>

          <Panel title="Recently added patients">
            {data.recentPatients.length === 0 ? (
              <p className="text-sm text-slate-500">No patients yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {data.recentPatients.map((patient) => (
                  <li key={patient._id} className="flex flex-wrap items-center gap-3 py-3">
                    <Avatar name={patient.name} tone="slate" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink-900">{patient.name}</p>
                      <p className="truncate text-xs text-slate-500">{patient.doctor?.name || 'Unassigned'}</p>
                    </div>
                    <ConditionBadge condition={patient.condition} />
                    <span className="w-24 text-right text-xs text-slate-500">{formatDate(patient.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
