'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, clearAuth, type AuthData } from '@/lib/token';

const navItems = [
  { label: 'Dashboard', icon: '📊', href: '/dashboard' },
  { label: 'Kalender', icon: '📅', href: '/dashboard/kalender' },
  { label: 'Kunden', icon: '👥', href: '/dashboard/kunden' },
  { label: 'Services', icon: '✂️', href: '/dashboard/services' },
  { label: 'Mitarbeiter', icon: '🧑‍💼', href: '/dashboard/mitarbeiter' },
  { label: 'Einstellungen', icon: '⚙️', href: '/dashboard/einstellungen' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const data = getAuth();
    if (!data) {
      router.push('/auth/login');
    } else {
      void Promise.resolve().then(() => {
        setAuth(data);
        setReady(true);
      });
    }
  }, [router]);

  function handleLogout() {
    clearAuth();
    router.push('/auth/login');
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Laden…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black text-white min-h-screen p-6 flex-shrink-0">
        <Link href="/" className="text-2xl font-black mb-8">fades.</Link>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <div className="text-xs text-gray-500 mb-1">Angemeldet als</div>
          <div className="text-sm font-semibold">{auth?.user.salonName}</div>
          <div className="text-xs text-gray-400 capitalize">
            {auth?.user.role?.toLowerCase()}
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 block text-xs text-gray-500 hover:text-white transition-colors"
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black text-white z-20 flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-black">fades.</Link>
        <span className="text-sm text-gray-400">{auth?.user.salonName}</span>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto md:pt-0 pt-14">{children}</main>
    </div>
  );
}
