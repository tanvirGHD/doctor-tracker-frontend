import Link from 'next/link';
import { Pencil, Trash2, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Avatar, ConditionBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';

// showDoctor: show the "Doctor" column (hidden on a doctor's own page).
export default function PatientsTable({ patients, showDoctor = true, onEdit, onDelete, deleteLabel = 'Delete' }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50/70 text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Condition</th>
              {showDoctor && <th className="px-4 py-3">Doctor</th>}
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {patients.map((patient) => (
              <tr key={patient._id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={patient.name} tone="slate" />
                    <span>
                      <span className="block font-bold text-ink-900">{patient.name}</span>
                      <span className="text-xs text-slate-500">{patient.age} yrs, {patient.gender}</span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3"><ConditionBadge condition={patient.condition} /></td>
                {showDoctor && (
                  <td className="px-4 py-3">
                    {patient.doctor ? (
                      <Link href={`/doctors/${patient.doctor._id}`} className="font-semibold text-slate-700 hover:text-brand-700">
                        {patient.doctor.name}
                      </Link>
                    ) : '-'}
                  </td>
                )}
                <td className="px-4 py-3 text-slate-600">{patient.phone}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(patient.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(patient)} aria-label={`Edit ${patient.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onDelete(patient)} aria-label={`${deleteLabel} ${patient.name}`} className="hover:text-coral-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {patients.map((patient) => (
          <li key={patient._id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar name={patient.name} tone="slate" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink-900">{patient.name}</p>
                <p className="text-sm text-slate-500">{patient.age} yrs, {patient.gender}</p>
              </div>
              <ConditionBadge condition={patient.condition} />
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              {showDoctor && patient.doctor && <p>Doctor: <Link href={`/doctors/${patient.doctor._id}`} className="font-semibold text-brand-700">{patient.doctor.name}</Link></p>}
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{patient.phone}</p>
              <p className="text-xs text-slate-400">Added {formatDate(patient.createdAt)}</p>
            </div>
            <div className="mt-3 flex gap-2">
              {onEdit && <Button variant="secondary" size="sm" icon={Pencil} onClick={() => onEdit(patient)}>Edit</Button>}
              <Button variant="secondary" size="sm" icon={Trash2} onClick={() => onDelete(patient)} className="text-coral-600">{deleteLabel}</Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
