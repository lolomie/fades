'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken } from '@/lib/token';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  visitCount: number;
  totalSpent: number;
  lastVisit: string | null;
  tags: string[];
}

export default function KundenPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = useCallback(async (q: string) => {
    const token = getToken();
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const params = q ? `?search=${encodeURIComponent(q)}` : '';
      const res = await fetch(`/api/customers${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCustomers(data.customers ?? []);
    } catch {
      setError('Kunden konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCustomers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCustomers]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Kunden</h1>
        <div className="text-sm text-gray-400">{customers.length} Kunden</div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, E-Mail oder Telefon suchen…"
          className="w-full max-w-sm border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Laden…</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {search ? 'Keine Kunden gefunden.' : 'Noch keine Kunden vorhanden.'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Kontakt
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Besuche
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Umsatz
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Letzter Besuch
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm">
                      {c.firstName} {c.lastName}
                    </div>
                    {c.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {c.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="text-sm text-gray-600">{c.email ?? '—'}</div>
                    <div className="text-xs text-gray-400">{c.phone ?? ''}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">{c.visitCount}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium hidden md:table-cell">
                    {Number(c.totalSpent).toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500 hidden lg:table-cell">
                    {c.lastVisit
                      ? new Date(c.lastVisit).toLocaleDateString('de-DE')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
