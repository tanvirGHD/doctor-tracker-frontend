'use client';

import { useState } from 'react';
import { Input, Select, Textarea } from '@/components/ui/Field';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useDoctorOptions, useSavePatient } from '@/hooks/queries';
import { CONDITIONS, GENDERS } from '@/lib/constants';
import { PHONE_RE, fieldErrorsFrom } from '@/lib/forms';

// doctorId: patient is being added under a specific doctor (no doctor dropdown).
// Without it, the form shows a doctor dropdown.
export default function PatientForm({ patient, doctorId, onClose }) {
  const toast = useToast();
  const save = useSavePatient();
  const options = useDoctorOptions();
  const [values, setValues] = useState({
    name: patient?.name || '',
    age: patient?.age ?? '',
    gender: patient?.gender || '',
    phone: patient?.phone || '',
    condition: patient?.condition || '',
    notes: patient?.notes || '',
    doctor: patient?.doctor?._id || doctorId || '',
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Enter the patient’s name';
    const age = Number(values.age);
    if (values.age === '' || !Number.isInteger(age) || age < 0 || age > 130) next.age = 'Enter an age between 0 and 130';
    if (!values.gender) next.gender = 'Select a gender';
    if (!PHONE_RE.test(values.phone.trim())) next.phone = 'Enter a valid phone number';
    if (!values.condition) next.condition = 'Select a condition';
    if (!doctorId && !values.doctor) next.doctor = 'Select a doctor';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { doctor, ...rest } = values;
    const payload = doctorId ? rest : { ...rest, doctor };
    save.mutate(
      { id: patient?._id, doctorId, values: payload },
      {
        onSuccess: () => {
          toast.success(patient ? 'Patient updated' : 'Patient added');
          onClose();
        },
        onError: (err) => {
          const fields = fieldErrorsFrom(err);
          setErrors(fields);
          if (!Object.keys(fields).length) toast.error(err.message);
        },
      }
    );
  };

  const doctorOptions = (options.data?.data || []).map((d) => ({ value: d._id, label: `${d.name} (${d.specialization})` }));

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Input label="Full name" value={values.name} onChange={set('name')} error={errors.name} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Age" type="number" min="0" max="130" value={values.age} onChange={set('age')} error={errors.age} />
        <Select label="Gender" placeholder="Select" options={GENDERS} value={values.gender} onChange={set('gender')} error={errors.gender} />
        <Input label="Phone" type="tel" value={values.phone} onChange={set('phone')} error={errors.phone} className="sm:col-span-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Condition" placeholder="Select a condition" options={CONDITIONS} value={values.condition} onChange={set('condition')} error={errors.condition} />
        {!doctorId && (
          <Select
            label="Doctor"
            placeholder={options.isLoading ? 'Loading doctors...' : 'Select a doctor'}
            options={doctorOptions}
            value={values.doctor}
            onChange={set('doctor')}
            error={errors.doctor}
          />
        )}
      </div>
      <Textarea label="Notes (optional)" value={values.notes} onChange={set('notes')} error={errors.notes} maxLength={500} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={save.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={save.isPending}>
          {patient ? 'Save changes' : 'Add patient'}
        </Button>
      </div>
    </form>
  );
}
