'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Mail, Pencil, Phone, Plus, UserRound } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilterBar from '@/components/ui/FilterBar';
import Pagination from '@/components/ui/Pagination';
import EmptyState, { ErrorState } from '@/components/ui/EmptyState';
import Skeleton, { RowsSkeleton } from '@/components/ui/Skeleton';
import DoctorForm from '@/components/doctors/DoctorForm';
import PatientForm from '@/components/patients/PatientForm';
import PatientsTable from '@/components/patients/PatientsTable';
import useListParams from '@/hooks/useListParams';
import { useDoctor, useDoctorPatients, useRemoveDoctorPatient } from '@/hooks/queries';
import { useToast } from '@/context/ToastContext';
import { CONDITIONS } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();

  const doctorQuery = useDoctor(id);
  const list = useListParams({ condition: '', from: '', to: '' });
  const patientsQuery = useDoctorPatients(id, list.params);
  const removePatient = useRemoveDoctorPatient();

  const [editingDoctor, setEditingDoctor] = useState(false);
  const [patientForm, setPatientForm] = useState({ open: false, patient: null });
  const [toRemove, setToRemove] = useState(null);
  const closePatientForm = useCallback(() => setPatientForm({ open: false, patient: null }), []);

  const doctor = doctorQuery.data?.data;
  const patients = patientsQuery.data?.data || [];

  if (doctorQuery.isError) {
    return (
      <div className="panel">
        <ErrorState error={doctorQuery.error} />
        <div className="pb-8 text-center">
          <Button variant="secondary" onClick={() => router.push('/doctors')}>Back to doctors</Button>
        </div>
      </div>
    );
  }

  const confirmRemove = () =>
    removePatient.mutate(
      { doctorId: id, patientId: toRemove._id },
      {
        onSuccess: () => {
          toast.success('Patient removed');
          setToRemove(null);
        },
        onError: (err) => toast.error(err.message),
      }
    );

  return (
    <>
      <Link href="/doctors" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> All doctors
      </Link>

      <section className="panel mb-6 p-5 sm:p-6">
        {!doctor ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-extrabold text-brand-800" aria-hidden="true">
                {doctor.name.replace(/^Dr\.?\s+/i, '').split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()}
              </span>
              <div>
                <h1 className="text-2xl font-extrabold">{doctor.name}</h1>
                <p className="text-sm font-semibold text-brand-700">{doctor.specialization}</p>
                <p className="mt-0.5 text-xs text-slate-500">Added {formatDate(doctor.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-600 sm:items-end">
              <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" />{doctor.hospital}</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{doctor.phone}</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{doctor.email}</span>
            </div>
          </div>
        )}
        {doctor && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <UserRound className="h-4 w-4 text-slate-400" />
              <span><span className="font-extrabold text-ink-900">{doctor.patientCount}</span> patients under this doctor</span>
            </p>
            <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditingDoctor(true)}>Edit doctor</Button>
          </div>
        )}
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">Patients</h2>
        <Button icon={Plus} onClick={() => setPatientForm({ open: true, patient: null })} disabled={!doctor}>Add patient</Button>
      </div>

      <section className="panel overflow-hidden" aria-busy={patientsQuery.isPlaceholderData}>
        <FilterBar
          search={list.search}
          onSearch={list.setSearch}
          searchPlaceholder="Search by patient name or phone"
          selects={[{ key: 'condition', label: 'Condition', placeholder: 'All conditions', options: CONDITIONS }]}
          filters={list.filters}
          onFilter={list.updateFilter}
          onReset={list.reset}
          hasActiveFilters={list.hasActiveFilters}
        />

        {patientsQuery.isLoading ? (
          <RowsSkeleton rows={4} />
        ) : patientsQuery.isError ? (
          <ErrorState error={patientsQuery.error} onRetry={patientsQuery.refetch} />
        ) : patients.length === 0 ? (
          list.hasActiveFilters ? (
            <EmptyState title="No patients match" message="Try a different search or clear the filters." action={<Button variant="secondary" onClick={list.reset}>Clear filters</Button>} />
          ) : (
            <EmptyState title="No patients yet" message="Add the first patient treated by this doctor." action={<Button icon={Plus} onClick={() => setPatientForm({ open: true, patient: null })}>Add patient</Button>} />
          )
        ) : (
          <div className={patientsQuery.isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <PatientsTable
              patients={patients}
              showDoctor={false}
              deleteLabel="Remove"
              onEdit={(patient) => setPatientForm({ open: true, patient })}
              onDelete={setToRemove}
            />
          </div>
        )}
        <Pagination pagination={patientsQuery.data?.pagination} onPageChange={list.setPage} />
      </section>

      <Modal open={editingDoctor} onClose={() => setEditingDoctor(false)} title="Edit doctor">
        {doctor && <DoctorForm doctor={doctor} onClose={() => setEditingDoctor(false)} />}
      </Modal>

      <Modal open={patientForm.open} onClose={closePatientForm} title={patientForm.patient ? 'Edit patient' : `Add patient under ${doctor?.name || 'this doctor'}`}>
        <PatientForm key={patientForm.patient?._id || 'new'} patient={patientForm.patient} doctorId={id} onClose={closePatientForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(toRemove)}
        title="Remove this patient?"
        message={toRemove ? `${toRemove.name} will be removed from ${doctor?.name}'s patient list and deleted. This cannot be undone.` : ''}
        confirmLabel="Remove patient"
        loading={removePatient.isPending}
        onConfirm={confirmRemove}
        onClose={() => setToRemove(null)}
      />
    </>
  );
}
