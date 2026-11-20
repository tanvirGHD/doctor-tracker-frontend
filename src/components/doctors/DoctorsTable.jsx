import Link from 'next/link';
import { Pencil, Trash2, Phone, Mail, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';

export default function DoctorsTable({ doctors, onEdit, onDelete }) {
  return (
    <>
      {/* Table on larger screens */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50/70 text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Patients</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <Link href={`/doctors/${doctor._id}`} className="flex items-center gap-3">
                    <Avatar name={doctor.name} />
                    <span>
                      <span className="block font-bold text-ink-900 hover:text-brand-700">{doctor.name}</span>
                      <span className="text-xs text-slate-500">{doctor.specialization}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{doctor.hospital}</td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="block">{doctor.phone}</span>
                  <span className="block text-xs text-slate-500">{doctor.email}</span>
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-ink-900">{doctor.patientCount}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(doctor.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(doctor)} aria-label={`Edit ${doctor.name}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(doctor)} aria-label={`Delete ${doctor.name}`} className="hover:text-coral-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards on phones */}
      <ul className="divide-y divide-line md:hidden">
        {doctors.map((doctor) => (
          <li key={doctor._id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar name={doctor.name} />
              <div className="min-w-0 flex-1">
                <Link href={`/doctors/${doctor._id}`} className="block font-bold text-ink-900">
                  {doctor.name}
                </Link>
                <p className="text-sm text-slate-500">{doctor.specialization}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800">{doctor.patientCount} patients</span>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /><dd>{doctor.hospital}</dd></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /><dd>{doctor.phone}</dd></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /><dd className="truncate">{doctor.email}</dd></div>
            </dl>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" icon={Pencil} onClick={() => onEdit(doctor)}>Edit</Button>
              <Button variant="secondary" size="sm" icon={Trash2} onClick={() => onDelete(doctor)} className="text-coral-600">Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
