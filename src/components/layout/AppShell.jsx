'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';

// Blocks the app for signed-out visitors and renders the responsive sidebar layout.
export default function AppShell({ children }) {
  const { status } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setMenuOpen(false)} />
          <div className="animate-slide-in absolute inset-y-0 left-0 w-72 max-w-[85%]">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute right-3 top-5 rounded-md p-1 text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
