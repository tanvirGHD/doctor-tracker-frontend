import Image from 'next/image';
import Logo from '@/components/layout/Logo';

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-10 text-white lg:flex">
        <Logo light />
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight text-white">Every doctor, every patient, in one clear view.</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100/80">
            Add doctors, keep track of who they are treating, and see how your numbers move from week to week.
          </p>
        </div>
        <Image src="/images/auth-illustration.svg" alt="" width={560} height={420} className="pointer-events-none absolute -bottom-6 -right-10 w-[78%] max-w-xl opacity-95" priority />
      </aside>
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
