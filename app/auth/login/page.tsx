'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveAuth } from '@/lib/token';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Anmeldung fehlgeschlagen.');
        return;
      }
      saveAuth({ token: data.token, user: data.user });
      router.push('/dashboard');
    } catch {
      setError('Verbindungsfehler. Bitte erneut versuchen.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="text-3xl font-black mb-8">fades.</Link>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-1">Willkommen zurück</h1>
        <p className="text-gray-500 text-sm mb-6">Melde dich in deinem Salon-Account an.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">E-Mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="dein@salon.de"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Passwort</label>
              <Link href="#" className="text-xs text-gray-500 hover:text-black">
                Vergessen?
              </Link>
            </div>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-sm mt-2"
          >
            {isLoading ? 'Anmelden…' : 'Anmelden'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Noch kein Account?{' '}
          <Link href="/auth/register" className="font-semibold text-black hover:underline">
            Kostenlos registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
