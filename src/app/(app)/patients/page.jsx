'use client';

import { useCallback, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilterBar from '@/components/ui/FilterBar';
import Pagination from '@/components/ui/Pagination';
import EmptyState, { ErrorState } from '@/components/ui/EmptyState';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import PatientForm from '@/components/patients/PatientForm';
import PatientsTable from '@/components/patients/PatientsTable';
import useListParams from '@/hooks/useListParams';
import { useDeletePatient, useDoctorOptions, usePatients } from '@/hooks/queries';
import { useToast } from '@/context/ToastContext';
import { CONDITIONS } from '@/lib/constants';

export default function PatientsPage() {
  const toast = useToast();
  const list = useListParams({ condition: '', doctor: '', from: '', to: '' });
  const { data, isLoading, isError, error, refetch, isPlaceholderData } = usePatients(list.params);
  const doctorOptions = useDoctorOptions();
  const deletePatient = useDeletePatient();

  const [formState, setFormState] = useState({ open: false, patient: null });
  const [toDelete, setToDelete] = useState(null);
  const closeForm = useCallback(() => setFormState({ open: false, patient: null }), []);

  const doctorSelect = useMemo(
    () => (doctorOptions.data?.data || []).map((d) => ({ value: d._id, label: d.name })),
    [doctorOptions.data]
  );

  const confirmDelete = () =>
    deletePatient.mutate(toDelete._id, {
      onSuccess: () => {
        toast.success('Patient deleted');
        setToDelete(null);
      },
      onError: (err) => toast.error(err.message),
    });

  const patients = data?.data || [];
  const noDoctors = doctorOptions.isSuccess && doctorSelect.length === 0;

  return (
    <>
      <PageHeader
        title="Patients"
        description="Everyone being treated across all of your doctors."
        action={<Button icon={Plus} onClick={() => setFormState({ open: true, patient: null })} disabled={noDoctors}>Add patient</Button>}
      />

      {noDoctors && (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Add a doctor first. Every patient needs a doctor to be assigned to.
        </p>
      )}

      <section className="panel overflow-hidden" aria-busy={isPlaceholderData}>
        <FilterBar
          search={list.search}
          onSearch={list.setSearch}
          searchPlaceholder="Search by patient name or phone"
          selects={[
            { key: 'condition', label: 'Condition', placeholder: 'All conditions', options: CONDITIONS },
            { key: 'doctor', label: 'Doctor', placeholder: 'All doctors', options: doctorSelect },
          ]}
          filters={list.filters}
          onFilter={list.updateFilter}
          onReset={list.reset}
          hasActiveFilters={list.hasActiveFilters}
        />

        {isLoading ? (
          <RowsSkeleton />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : patients.length === 0 ? (
          list.hasActiveFilters ? (
            <EmptyState title="No patients match" message="Try a different search or clear the filters." action={<Button variant="secondary" onClick={list.reset}>Clear filters</Button>} />
          ) : (
            <EmptyState title="No patients yet" message="Patients you add will show up here." />
          )
        ) : (
          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <PatientsTable patients={patients} onEdit={(patient) => setFormState({ open: true, patient })} onDelete={setToDelete} />
          </div>
        )}

        <Pagination pagination={data?.pagination} onPageChange={list.setPage} />
      </section>

      <Modal open={formState.open} onClose={closeForm} title={formState.patient ? 'Edit patient' : 'Add patient'}>
        <PatientForm key={formState.patient?._id || 'new'} patient={formState.patient} onClose={closeForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this patient?"
        message={toDelete ? `${toDelete.name} will be permanently deleted. This cannot be undone.` : ''}
        loading={deletePatient.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
