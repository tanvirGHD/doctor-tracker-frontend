import Image from 'next/image';

export default function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logo-mark.svg" alt="" width={32} height={32} priority />
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`}>Doctor Tracker</span>
    </span>
  );
}
