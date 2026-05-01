'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getToken, getAuth } from '@/lib/token';

interface Appointment {
  id: string;
  startsAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  price: number;
  customer: { firstName: string; lastName: string } | null;
  employee: { firstName: string; lastName: string };
  service: { name: string };
}

const statusConfig = {
  PENDING: { label: 'Ausstehend', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  CONFIRMED: { label: 'Bestätigt', bg: 'bg-blue-50', text: 'text-blue-700' },
  COMPLETED: { label: 'Erledigt', bg: 'bg-green-50', text: 'text-green-700' },
  CANCELLED: { label: 'Storniert', bg: 'bg-red-50', text: 'text-red-700' },
  NO_SHOW: { label: 'Nicht erschienen', bg: 'bg-orange-50', text: 'text-orange-700' },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const salonSlug = getAuth()?.user.salonSlug ?? 'mein-salon';

  const today = new Date();
  const dateStr = today.toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const todayISO = today.toISOString().split('T')[0];

  const fetchAppointments = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/appointments?date=${todayISO}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Fehler beim Laden');
      const data = await res.json();
      setAppointments(data.appointments ?? []);
    } catch {
      setError('Termine konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, [todayISO]);

  useEffect(() => {
    void Promise.resolve().then(fetchAppointments);
  }, [fetchAppointments]);

  async function updateStatus(id: string, status: 'COMPLETED' | 'CANCELLED') {
    const token = getToken();
    if (!token) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      void fetchAppointments();
    }
  }

  const totalRevenue = appointments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + Number(a.price), 0);
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const upcomingCount = appointments.filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status)).length;
  const cancelledCount = appointments.filter((a) => ['CANCELLED', 'NO_SHOW'].includes(a.status)).length;
  const cancelledRevenue = appointments
    .filter((a) => ['CANCELLED', 'NO_SHOW'].includes(a.status))
    .reduce((sum, a) => sum + Number(a.price), 0);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Heutiger Überblick</h1>
          <p className="text-gray-500 text-sm mt-0.5 capitalize">{dateStr}</p>
        </div>
        <Link
          href={`/booking/${salonSlug}`}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Buchungslink
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Termine heute', value: appointments.length, icon: '📅', dark: false },
          { label: 'Ausstehend', value: upcomingCount, icon: '⏳', dark: false },
          { label: 'Abgeschlossen', value: completedCount, icon: '✅', dark: false },
          { label: 'Tagesumsatz', value: `${totalRevenue.toFixed(2)} €`, icon: '💰', dark: true },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-2xl p-5 border border-gray-100 ${kpi.dark ? 'bg-black text-white' : 'bg-white'}`}
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div className={`text-2xl font-black ${kpi.dark ? 'text-white' : 'text-gray-900'}`}>
              {kpi.value}
            </div>
            <div className={`text-sm ${kpi.dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">Termine heute</h2>
          <span className="text-sm text-gray-400">{appointments.length} gesamt</span>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">Laden…</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-600 text-sm">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            Noch keine Termine für heute.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.map((appt) => {
              const status = statusConfig[appt.status];
              const isUpcoming = appt.status === 'PENDING' || appt.status === 'CONFIRMED';
              const customerName = appt.customer
                ? `${appt.customer.firstName} ${appt.customer.lastName}`
                : 'Unbekannt';
              const employeeName = `${appt.employee.firstName} ${appt.employee.lastName}`;

              return (
                <div key={appt.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-14 text-sm font-bold text-gray-900 flex-shrink-0">
                    {formatTime(appt.startsAt)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{customerName}</div>
                    <div className="text-xs text-gray-500">
                      {appt.service.name} · {employeeName}
                    </div>
                  </div>
                  <div className="text-sm font-semibold hidden sm:block">
                    {Number(appt.price).toFixed(2)} €
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full hidden sm:block ${status.bg} ${status.text}`}
                  >
                    {status.label}
                  </span>
                  {isUpcoming && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatus(appt.id, 'COMPLETED')}
                        className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, 'CANCELLED')}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cancelledCount > 0 && (
        <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-700">
          <strong>{cancelledCount} stornierte</strong> Termine heute — Entgangener Umsatz:{' '}
          <strong>{cancelledRevenue.toFixed(2)} €</strong>
        </div>
      )}
    </div>
  );
}
