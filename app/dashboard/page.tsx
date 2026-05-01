'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  time: string;
  customerName: string;
  service: string;
  employee: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '09:00', customerName: 'Kemal Demir', service: 'Fade + Bartpflege', employee: 'Ahmed', price: 38, status: 'upcoming' },
  { id: '2', time: '09:45', customerName: 'Jonas Bauer', service: 'Haarschnitt', employee: 'Marco', price: 25, status: 'upcoming' },
  { id: '3', time: '10:30', customerName: 'Luca Ricci', service: 'Komplettpaket', employee: 'Ahmed', price: 55, status: 'upcoming' },
  { id: '4', time: '11:15', customerName: 'Marko Petrovic', service: 'Bart trimmen', employee: 'Marco', price: 18, status: 'completed' },
  { id: '5', time: '12:00', customerName: 'David Müller', service: 'Haarschnitt', employee: 'Ahmed', price: 25, status: 'completed' },
  { id: '6', time: '14:00', customerName: 'Raphael Schmidt', service: 'Fade + Bartpflege', employee: 'Marco', price: 38, status: 'upcoming' },
  { id: '7', time: '14:45', customerName: 'Tobias König', service: 'Haarschnitt', employee: 'Ahmed', price: 25, status: 'cancelled' },
  { id: '8', time: '15:30', customerName: 'Nico Weber', service: 'Komplettpaket', employee: 'Marco', price: 55, status: 'upcoming' },
];

const statusConfig = {
  upcoming: { label: 'Ausstehend', bg: 'bg-blue-50', text: 'text-blue-700' },
  completed: { label: 'Erledigt', bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { label: 'Storniert', bg: 'bg-red-50', text: 'text-red-700' },
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const today = new Date();
  const dateStr = today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const totalRevenue = appointments.filter((a) => a.status === 'completed').reduce((sum, a) => sum + a.price, 0);
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const upcomingCount = appointments.filter((a) => a.status === 'upcoming').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  function markComplete(id: string) {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'completed' } : a));
  }

  function cancelAppointment(id: string) {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cancelled' } : a));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black text-white min-h-screen p-6">
        <Link href="/" className="text-2xl font-black mb-8">fades.</Link>
        <nav className="space-y-1 flex-1">
          {[
            { label: 'Dashboard', icon: '📊', href: '/dashboard', active: true },
            { label: 'Kalender', icon: '📅', href: '#' },
            { label: 'Kunden', icon: '👥', href: '#' },
            { label: 'Services', icon: '✂️', href: '#' },
            { label: 'Mitarbeiter', icon: '🧑‍💼', href: '#' },
            { label: 'Einstellungen', icon: '⚙️', href: '#' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <div className="text-xs text-gray-500 mb-1">Angemeldet als</div>
          <div className="text-sm font-semibold">Mein Barbershop</div>
          <div className="text-xs text-gray-400">Grow-Plan</div>
          <Link href="/auth/login" className="mt-3 block text-xs text-gray-500 hover:text-white transition-colors">
            Abmelden
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <Link href="/" className="text-xl font-black">fades.</Link>
          <span className="text-sm text-gray-500">Mein Barbershop</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Heutiger Überblick</h1>
            <p className="text-gray-500 text-sm mt-0.5 capitalize">{dateStr}</p>
          </div>
          <Link href="/booking/mein-salon"
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            + Buchungslink
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Termine heute', value: appointments.length, icon: '📅', color: 'bg-white' },
            { label: 'Ausstehend', value: upcomingCount, icon: '⏳', color: 'bg-white' },
            { label: 'Abgeschlossen', value: completedCount, icon: '✅', color: 'bg-white' },
            { label: 'Tagesumsatz', value: `${totalRevenue} €`, icon: '💰', color: 'bg-black text-white' },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-2xl p-5 ${kpi.color} border border-gray-100`}>
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <div className={`text-2xl font-black ${kpi.color.includes('black') ? 'text-white' : 'text-gray-900'}`}>
                {kpi.value}
              </div>
              <div className={`text-sm ${kpi.color.includes('black') ? 'text-gray-400' : 'text-gray-500'}`}>
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
          <div className="divide-y divide-gray-50">
            {appointments.map((appt) => {
              const status = statusConfig[appt.status];
              return (
                <div key={appt.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-14 text-sm font-bold text-gray-900 flex-shrink-0">{appt.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{appt.customerName}</div>
                    <div className="text-xs text-gray-500">{appt.service} · {appt.employee}</div>
                  </div>
                  <div className="text-sm font-semibold hidden sm:block">{appt.price} €</div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text} hidden sm:block`}>
                    {status.label}
                  </span>
                  {appt.status === 'upcoming' && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => markComplete(appt.id)}
                        className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-medium">
                        ✓
                      </button>
                      <button onClick={() => cancelAppointment(appt.id)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium">
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stornierte Termine Stats */}
        {cancelledCount > 0 && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-700">
            <strong>{cancelledCount} stornierte</strong> Termine heute — Entgangener Umsatz:{' '}
            <strong>{appointments.filter((a) => a.status === 'cancelled').reduce((s, a) => s + a.price, 0)} €</strong>
          </div>
        )}
      </main>
    </div>
  );
}
