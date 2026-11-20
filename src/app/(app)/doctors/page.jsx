'use client';

import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilterBar from '@/components/ui/FilterBar';
import Pagination from '@/components/ui/Pagination';
import EmptyState, { ErrorState } from '@/components/ui/EmptyState';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import DoctorsTable from '@/components/doctors/DoctorsTable';
import DoctorForm from '@/components/doctors/DoctorForm';
import useListParams from '@/hooks/useListParams';
import { useDeleteDoctor, useDoctorFilters, useDoctors } from '@/hooks/queries';
import { useToast } from '@/context/ToastContext';

export default function DoctorsPage() {
  const toast = useToast();
  const list = useListParams({ specialization: '', hospital: '', from: '', to: '' });
  const { data, isLoading, isError, error, refetch, isPlaceholderData } = useDoctors(list.params);
  const { data: filterOptions } = useDoctorFilters();
  const deleteDoctor = useDeleteDoctor();

  const [formState, setFormState] = useState({ open: false, doctor: null });
  const [toDelete, setToDelete] = useState(null);

  const closeForm = useCallback(() => setFormState({ open: false, doctor: null }), []);

  const confirmDelete = () =>
    deleteDoctor.mutate(toDelete._id, {
      onSuccess: () => {
        toast.success('Doctor deleted');
        setToDelete(null);
      },
      onError: (err) => toast.error(err.message),
    });

  const doctors = data?.data || [];

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Add doctors and open one to see and manage their patients."
        action={<Button icon={Plus} onClick={() => setFormState({ open: true, doctor: null })}>Add doctor</Button>}
      />

      <section className="panel overflow-hidden" aria-busy={isPlaceholderData}>
        <FilterBar
          search={list.search}
          onSearch={list.setSearch}
          searchPlaceholder="Search by name, specialization, hospital or email"
          selects={[
            { key: 'specialization', label: 'Specialization', placeholder: 'All specializations', options: filterOptions?.specializations || [] },
            { key: 'hospital', label: 'Hospital', placeholder: 'All hospitals', options: filterOptions?.hospitals || [] },
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
        ) : doctors.length === 0 ? (
          list.hasActiveFilters ? (
            <EmptyState title="No doctors match" message="Try a different search or clear the filters." action={<Button variant="secondary" onClick={list.reset}>Clear filters</Button>} />
          ) : (
            <EmptyState title="No doctors yet" message="Add your first doctor to start tracking patients." action={<Button icon={Plus} onClick={() => setFormState({ open: true, doctor: null })}>Add doctor</Button>} />
          )
        ) : (
          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <DoctorsTable doctors={doctors} onEdit={(doctor) => setFormState({ open: true, doctor })} onDelete={setToDelete} />
          </div>
        )}

        <Pagination pagination={data?.pagination} onPageChange={list.setPage} />
      </section>

      <Modal open={formState.open} onClose={closeForm} title={formState.doctor ? 'Edit doctor' : 'Add doctor'}>
        <DoctorForm key={formState.doctor?._id || 'new'} doctor={formState.doctor} onClose={closeForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this doctor?"
        message={toDelete ? `${toDelete.name} and all ${toDelete.patientCount} of their patients will be deleted. This cannot be undone.` : ''}
        loading={deleteDoctor.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
