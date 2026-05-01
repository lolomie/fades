'use client';

import { use, useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  color: string;
}

interface TimeSlot {
  time: string;
  datetime: string;
  available: boolean;
  employeeId: string;
  employeeName: string;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
}

type Step = 'service' | 'slot' | 'details' | 'confirmation';

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Haarschnitt', description: 'Klassischer Herrenhaarschnitt inkl. Styling', durationMin: 30, price: 25, color: '#000000' },
  { id: '2', name: 'Fade + Bartpflege', description: 'Skin Fade mit Bartschnitt und Konturierung', durationMin: 45, price: 38, color: '#374151' },
  { id: '3', name: 'Bart trimmen', description: 'Bartpflege, Konturierung & Styling', durationMin: 20, price: 18, color: '#6B7280' },
  { id: '4', name: 'Komplettpaket', description: 'Haarschnitt + Fade + Bart + Augenbrauen', durationMin: 60, price: 55, color: '#111827' },
];

function generateSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const employees = [
    { id: 'e1', name: 'Ahmed' },
    { id: 'e2', name: 'Marco' },
  ];
  const hours = [9, 10, 11, 12, 14, 15, 16, 17, 18];
  hours.forEach((h) => {
    [0, 30].forEach((m) => {
      const emp = employees[Math.floor(Math.random() * employees.length)];
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const dt = new Date(date);
      dt.setHours(h, m, 0, 0);
      slots.push({
        time: timeStr,
        datetime: dt.toISOString(),
        available: Math.random() > 0.35,
        employeeId: emp.id,
        employeeName: emp.name,
      });
    });
  });
  return slots;
}

export default function BookingPage({ params }: { params: Promise<{ salonSlug: string }> }) {
  const { salonSlug } = use(params);
  const [step, setStep] = useState<Step>('service');
  const [services] = useState<Service[]>(MOCK_SERVICES);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<BookingFormData>({
    firstName: '', lastName: '', email: '', phone: '', gdprConsent: false,
  });

  useEffect(() => {
    if (!selectedService || step !== 'slot') return;
    let cancelled = false;
    void (async () => {
      setIsLoading(true);
      setSlots([]);
      await new Promise<void>((res) => setTimeout(res, 500));
      if (!cancelled) {
        setSlots(generateSlots(selectedDate));
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedService, selectedDate, step]);

  async function submitBooking() {
    if (!selectedSlot || !selectedService) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setStep('confirmation');
  }

  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const availableSlots = slots.filter((s) => s.available);

  const salonName = salonSlug === 'demo-salon' ? 'Fades Demo' : salonSlug;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-4 px-4 text-center">
        <Link href="/" className="text-xl font-black">fades.</Link>
        <p className="text-sm text-gray-400 mt-0.5">{salonName}</p>
      </div>

      {/* Progress */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {(['service', 'slot', 'details', 'confirmation'] as Step[]).map((s, i) => {
              const steps: Step[] = ['service', 'slot', 'details', 'confirmation'];
              const current = steps.indexOf(step);
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${step === s ? 'bg-black text-white' : i < current ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i < current ? '✓' : i + 1}
                  </div>
                  {i < 3 && <div className={`h-0.5 flex-1 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Step 1: Service */}
        {step === 'service' && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Was darf es sein?</h2>
            <p className="text-gray-500 mb-6">Wähle eine Dienstleistung</p>
            <div className="space-y-3">
              {services.map((service) => (
                <button key={service.id} onClick={() => { setSelectedService(service); setStep('slot'); }}
                  className="w-full text-left p-4 bg-white rounded-xl border-2 border-transparent hover:border-black transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: service.color }} />
                      <div>
                        <div className="font-semibold group-hover:text-black">{service.name}</div>
                        {service.description && <div className="text-sm text-gray-500 mt-0.5">{service.description}</div>}
                        <div className="text-sm text-gray-400 mt-1">⏱ {service.durationMin} Min.</div>
                      </div>
                    </div>
                    <div className="font-bold text-lg ml-4">{service.price.toFixed(2)} €</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Slot */}
        {step === 'slot' && selectedService && (
          <div>
            <button onClick={() => setStep('service')} className="text-gray-500 hover:text-black mb-4 flex items-center gap-1 text-sm">
              ← Zurück
            </button>
            <div className="bg-white rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedService.color }} />
              <div>
                <div className="font-semibold">{selectedService.name}</div>
                <div className="text-sm text-gray-500">{selectedService.durationMin} Min. · {selectedService.price.toFixed(2)} €</div>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Datum wählen</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
              {dateOptions.map((date) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <button key={date.toISOString()} onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl min-w-[64px] transition-all ${isSelected ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                    <span className="text-xs uppercase">{format(date, 'EEE', { locale: de })}</span>
                    <span className="text-lg font-bold">{format(date, 'd')}</span>
                    <span className="text-xs">{format(date, 'MMM', { locale: de })}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="font-semibold mb-3">Uhrzeit wählen</h3>
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-2xl mb-2 animate-spin">⏳</div>
                Lade verfügbare Zeiten...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="text-4xl mb-3">😔</div>
                <p className="text-gray-600 font-medium">Keine freien Termine an diesem Tag</p>
                <p className="text-gray-400 text-sm mt-1">Bitte wähle einen anderen Tag</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button key={slot.time} onClick={() => { setSelectedSlot(slot); setStep('details'); }}
                    className="py-3 px-4 bg-white rounded-xl font-medium hover:bg-black hover:text-white transition-all text-center text-sm">
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <div>
            <button onClick={() => setStep('slot')} className="text-gray-500 hover:text-black mb-4 flex items-center gap-1 text-sm">
              ← Zurück
            </button>
            <div className="bg-black text-white rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-400">Dein Termin</div>
              <div className="font-bold text-lg">{selectedService?.name}</div>
              <div className="text-gray-300 text-sm mt-1">
                {format(selectedDate, 'EEEE, d. MMMM', { locale: de })} um {selectedSlot?.time} Uhr
              </div>
              <div className="text-gray-300 text-sm">mit {selectedSlot?.employeeName}</div>
            </div>

            <h3 className="font-semibold text-xl mb-4">Deine Daten</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Vorname *</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Ali" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nachname *</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Yilmaz" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">E-Mail *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="ali@example.de" />
                <p className="text-xs text-gray-400 mt-1">Wir senden dir eine Bestätigungs-E-Mail</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Telefon (optional)</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="+49 151 23456789" />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.gdprConsent} onChange={(e) => setForm((f) => ({ ...f, gdprConsent: e.target.checked }))}
                  className="mt-1 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Ich stimme der Verarbeitung meiner personenbezogenen Daten zur Terminbuchung gemäß der{' '}
                  <Link href="#" className="underline">Datenschutzerklärung</Link> zu. *
                </span>
              </label>
              <button onClick={submitBooking}
                disabled={isLoading || !form.firstName || !form.lastName || !form.email || !form.gdprConsent}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4">
                {isLoading ? 'Wird gebucht...' : 'Termin verbindlich buchen'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Termin bestätigt!</h2>
            <p className="text-gray-500 mb-6">
              Wir haben dir eine Bestätigung an <span className="font-medium text-black">{form.email}</span> gesendet.
            </p>
            <div className="bg-white rounded-xl p-6 text-left mb-6">
              <h3 className="font-semibold mb-3">Dein Termin</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Datum</span>
                  <span className="font-medium">{format(selectedDate, 'EEEE, d. MMMM yyyy', { locale: de })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Uhrzeit</span>
                  <span className="font-medium">{selectedSlot?.time} Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mitarbeiter</span>
                  <span className="font-medium">{selectedSlot?.employeeName}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-500">Preis</span>
                  <span className="font-bold text-base">{selectedService?.price.toFixed(2)} €</span>
                </div>
              </div>
            </div>
            <Link href="/" className="text-sm text-gray-500 hover:text-black underline">
              Zurück zur Startseite
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
