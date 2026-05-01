'use client';

import { useState, useEffect, useCallback } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { getToken } from '@/lib/token';

interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  price: number;
  customer: { firstName: string; lastName: string } | null;
  employee: { firstName: string; lastName: string };
  service: { name: string; color?: string };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  CONFIRMED: 'bg-blue-100 border-blue-300 text-blue-800',
  COMPLETED: 'bg-green-100 border-green-300 text-green-800',
  CANCELLED: 'bg-red-100 border-red-300 text-red-800',
  NO_SHOW: 'bg-orange-100 border-orange-300 text-orange-800',
};

export default function KalenderPage() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [appointmentsByDay, setAppointmentsByDay] = useState<
    Record<string, Appointment[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchWeek = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const results = await Promise.all(
        weekDays.map((day) =>
          fetch(`/api/appointments?date=${format(day, 'yyyy-MM-dd')}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
        ),
      );
      const map: Record<string, Appointment[]> = {};
      weekDays.forEach((day, i) => {
        map[format(day, 'yyyy-MM-dd')] = results[i]?.appointments ?? [];
      });
      setAppointmentsByDay(map);
    } catch {
      setError('Kalender konnte nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  useEffect(() => {
    void Promise.resolve().then(fetchWeek);
  }, [fetchWeek]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kalender</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekStart((d) => addDays(d, -7))}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            ← Vorherige Woche
          </button>
          <span className="text-sm font-medium text-gray-600">
            {format(weekStart, 'd. MMM', { locale: de })} –{' '}
            {format(addDays(weekStart, 6), 'd. MMM yyyy', { locale: de })}
          </span>
          <button
            onClick={() => setWeekStart((d) => addDays(d, 7))}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            Nächste Woche →
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Laden…</div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const isToday = key === todayStr;
            const dayAppts = appointmentsByDay[key] ?? [];

            return (
              <div key={key} className="min-w-0">
                <div
                  className={`text-center mb-2 pb-2 border-b ${isToday ? 'border-black' : 'border-gray-200'}`}
                >
                  <div className="text-xs text-gray-500 uppercase">
                    {format(day, 'EEE', { locale: de })}
                  </div>
                  <div
                    className={`text-lg font-bold ${isToday ? 'text-black' : 'text-gray-700'}`}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {dayAppts.length === 0 ? (
                    <div className="text-xs text-gray-300 text-center py-2">—</div>
                  ) : (
                    dayAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className={`text-xs px-2 py-1.5 rounded-lg border ${statusColors[appt.status] ?? 'bg-gray-100 border-gray-200'}`}
                      >
                        <div className="font-semibold truncate">
                          {new Date(appt.startsAt).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="truncate">
                          {appt.customer
                            ? `${appt.customer.firstName} ${appt.customer.lastName}`
                            : '—'}
                        </div>
                        <div className="truncate opacity-70">{appt.service.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
