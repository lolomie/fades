'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken } from '@/lib/token';

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number;
  color: string | null;
  isActive: boolean;
  category: string | null;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', durationMin: 30, price: 0, color: '#000000',
  });
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setServices(data.services ?? []);
    } catch {
      setError('Services konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchServices);
  }, [fetchServices]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setShowForm(false);
      setForm({ name: '', description: '', durationMin: 30, price: 0, color: '#000000' });
      void fetchServices();
    } catch {
      setError('Service konnte nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Neuer Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-bold mb-4">Neuer Service</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Farbe</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="w-full h-10 border rounded-xl px-2 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Beschreibung</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Dauer (Minuten) *
                </label>
                <input
                  type="number"
                  min={5}
                  value={form.durationMin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, durationMin: Number(e.target.value) }))
                  }
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Preis (€) *</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-500 hover:text-black px-4 py-2.5"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Laden…</div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Noch keine Services vorhanden.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {services.map((s) => (
              <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: s.color ?? '#000' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{s.name}</div>
                  {s.description && (
                    <div className="text-xs text-gray-500 truncate">{s.description}</div>
                  )}
                </div>
                <div className="text-sm text-gray-500 hidden sm:block">{s.durationMin} Min.</div>
                <div className="text-sm font-bold">{Number(s.price).toFixed(2)} €</div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    s.isActive
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
