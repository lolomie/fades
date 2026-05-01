'use client';

import { useState, useEffect } from 'react';
import { getAuth } from '@/lib/token';
import type { AuthUser } from '@/lib/token';

const planLabels: Record<string, string> = {
  STARTER: 'Starter — 29€/Monat',
  GROW: 'Grow — 59€/Monat',
  PRO: 'Pro — 99€/Monat',
  BUSINESS: 'Business',
};

export default function EinstellungenPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    void Promise.resolve().then(() => {
      if (auth) setUser(auth.user);
    });
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold">Account</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Salonname</span>
            <span className="text-sm font-semibold">{user.salonName}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-50">
            <span className="text-sm text-gray-500">Buchungs-URL</span>
            <span className="text-sm font-mono text-gray-700">
              /booking/{user.salonSlug}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-50">
            <span className="text-sm text-gray-500">Inhaber</span>
            <span className="text-sm font-semibold">
              {user.firstName} {user.lastName}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-50">
            <span className="text-sm text-gray-500">E-Mail</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-50">
            <span className="text-sm text-gray-500">Rolle</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium capitalize">
              {user.role.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Passwort ändern */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold">Passwort ändern</h2>
        </div>
        <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Aktuelles Passwort
            </label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Neues Passwort</label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Mindestens 8 Zeichen"
              minLength={8}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Neues Passwort bestätigen
            </label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Passwort speichern
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">Gespeichert!</span>
            )}
          </div>
        </form>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold">Plan & Abrechnung</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Aktueller Plan</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {planLabels['GROW']}
              </div>
            </div>
            <button className="text-sm border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
