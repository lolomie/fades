'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken } from '@/lib/token';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  color: string | null;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  OWNER: 'Inhaber',
  EMPLOYEE: 'Mitarbeiter',
  PLATFORM_ADMIN: 'Admin',
};

export default function MitarbeiterPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployees(data.employees ?? []);
    } catch {
      setError('Mitarbeiter konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchEmployees);
  }, [fetchEmployees]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mitarbeiter</h1>
        <span className="text-sm text-gray-400">{employees.length} Mitarbeiter</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Laden…</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Noch keine Mitarbeiter vorhanden.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {employees.map((emp) => (
              <div key={emp.id} className="px-6 py-4 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: emp.color ?? '#374151' }}
                >
                  {emp.firstName.charAt(0)}
                  {emp.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{emp.email}</div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    {roleLabels[emp.role] ?? emp.role}
                  </span>
                </div>
                <div className="text-xs text-gray-400 hidden lg:block">
                  {emp.phone ?? '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
