'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Field';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useSaveDoctor } from '@/hooks/queries';
import { EMAIL_RE, PHONE_RE, fieldErrorsFrom } from '@/lib/forms';

const EMPTY = { name: '', specialization: '', hospital: '', phone: '', email: '' };

export default function DoctorForm({ doctor, onClose }) {
  const toast = useToast();
  const save = useSaveDoctor();
  const [values, setValues] = useState(
    doctor
      ? { name: doctor.name, specialization: doctor.specialization, hospital: doctor.hospital, phone: doctor.phone, email: doctor.email }
      : EMPTY
  );
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Enter the doctor’s name';
    if (!values.specialization.trim()) next.specialization = 'Enter a specialization';
    if (!values.hospital.trim()) next.hospital = 'Enter a hospital';
    if (!PHONE_RE.test(values.phone.trim())) next.phone = 'Enter a valid phone number';
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'Enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    save.mutate(
      { id: doctor?._id, values },
      {
        onSuccess: () => {
          toast.success(doctor ? 'Doctor updated' : 'Doctor added');
          onClose();
        },
        onError: (err) => {
          const fields = fieldErrorsFrom(err);
          if (err.status === 409) fields.email = err.message;
          setErrors(fields);
          if (!Object.keys(fields).length) toast.error(err.message);
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Input label="Full name" value={values.name} onChange={set('name')} error={errors.name} placeholder="Dr. Amina Rahman" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Specialization" value={values.specialization} onChange={set('specialization')} error={errors.specialization} placeholder="Cardiology" />
        <Input label="Hospital" value={values.hospital} onChange={set('hospital')} error={errors.hospital} placeholder="Square Hospital" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Phone" type="tel" value={values.phone} onChange={set('phone')} error={errors.phone} placeholder="+8801700000000" />
        <Input label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} placeholder="doctor@hospital.com" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={save.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={save.isPending}>
          {doctor ? 'Save changes' : 'Add doctor'}
        </Button>
      </div>
    </form>
  );
}
