'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const plans = [
  { id: 'starter', name: 'Starter', price: '29€/Monat', desc: 'Bis zu 2 Mitarbeiter' },
  { id: 'grow', name: 'Grow', price: '59€/Monat', desc: 'Empfohlen' },
  { id: 'pro', name: 'Pro', price: '99€/Monat', desc: 'Unbegrenzte Mitarbeiter' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState('grow');
  const [form, setForm] = useState({
    salonName: '', ownerName: '', email: '', password: '', phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="text-3xl font-black mb-8">fades.</Link>

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold mb-1">Plan wählen</h1>
            <p className="text-gray-500 text-sm mb-6">Alle Pläne inklusive 14-tägiger Testphase.</p>

            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedPlan === plan.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{plan.name}</div>
                      <div className={`text-sm ${selectedPlan === plan.id ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</div>
                    </div>
                    <div className="font-semibold text-sm">{plan.price}</div>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all text-sm">
              Weiter →
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Bereits registriert?{' '}
              <Link href="/auth/login" className="font-semibold text-black hover:underline">Anmelden</Link>
            </p>
          </>
        ) : (
          <>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black text-sm mb-4 flex items-center gap-1">
              ← Zurück
            </button>
            <h1 className="text-2xl font-bold mb-1">Salon anlegen</h1>
            <p className="text-gray-500 text-sm mb-6">
              Plan: <span className="font-semibold text-black capitalize">{selectedPlan}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Salonname *</label>
                <input type="text" value={form.salonName} onChange={(e) => setForm((f) => ({ ...f, salonName: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="Mein Barbershop" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Dein Name *</label>
                <input type="text" value={form.ownerName} onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="Max Mustermann" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">E-Mail *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="salon@example.de" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Passwort *</label>
                <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="Mindestens 8 Zeichen" required minLength={8} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Telefon (optional)</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="+49 151 23456789" />
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-sm mt-2">
                {isLoading ? 'Konto wird erstellt...' : 'Kostenlos starten'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Mit der Registrierung stimmst du unseren AGB und der Datenschutzerklärung zu.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
