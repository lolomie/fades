import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">
          fades.
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="#preise" className="hover:text-black transition-colors">Preise</Link>
          <Link href="#wie-es-funktioniert" className="hover:text-black transition-colors">So funktionierts</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Anmelden
          </Link>
          <Link href="/auth/register" className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Kostenlos starten
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-40">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Jetzt für Barbershops & Salons verfügbar
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6 max-w-3xl">
          Dein Salon.<br />
          <span className="text-gray-400">Dein Termin.</span><br />
          Kein Stress.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
          Fades digitalisiert deine Terminbuchung — deine Kunden buchen online,
          du siehst alles auf einen Blick.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/auth/register" className="inline-flex items-center justify-center bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all text-base">
            14 Tage kostenlos testen →
          </Link>
          <Link href="/booking/demo-salon" className="inline-flex items-center justify-center border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
            Demo ansehen
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Keine Kreditkarte erforderlich · Kündigung jederzeit möglich
        </p>
      </div>
    </section>
  );
}

const features = [
  { icon: "📅", title: "Online-Buchung 24/7", desc: "Deine Kunden buchen direkt über deine persönliche Buchungsseite — auch nachts und am Wochenende." },
  { icon: "🔔", title: "Automatische Erinnerungen", desc: "E-Mail- und SMS-Erinnerungen reduzieren No-Shows um bis zu 70 %." },
  { icon: "📊", title: "Dashboard & Statistiken", desc: "Umsatz, Auslastung und Top-Services auf einen Blick — direkt im Browser." },
  { icon: "💳", title: "No-Show-Schutz", desc: "Kreditkartenhinterlegung bei der Buchung schützt dich vor verpassten Terminen." },
  { icon: "👥", title: "Mitarbeiterverwaltung", desc: "Verwalte Arbeitszeiten und Services für dein gesamtes Team." },
  { icon: "🔒", title: "DSGVO-konform", desc: "Alle Daten in deutschen Rechenzentren. Vollständig DSGVO-konform." },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Alles was du brauchst.</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Von der Buchung bis zur Abrechnung — Fades deckt den gesamten Salon-Alltag ab.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { num: "01", title: "Salon anlegen", desc: "Registriere dich, füge deine Services und Öffnungszeiten hinzu — in 10 Minuten bist du live." },
  { num: "02", title: "Link teilen", desc: "Teile deinen persönlichen Buchungslink auf Instagram, WhatsApp oder deiner Website." },
  { num: "03", title: "Kunden buchen", desc: "Kunden wählen Service, Datum und Uhrzeit — du bekommst sofort eine Benachrichtigung." },
];

function HowItWorks() {
  return (
    <section id="wie-es-funktioniert" className="py-24 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">In 3 Schritten online.</h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Kein technisches Wissen nötig — Fades ist in Minuten eingerichtet.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num}>
              <div className="text-6xl font-black text-white/10 mb-4">{s.num}</div>
              <h3 className="font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Starter", price: "29", desc: "Für Einzelsalons, die digital durchstarten wollen.",
    features: ["Online-Buchung", "Bis zu 2 Mitarbeiter", "E-Mail-Bestätigungen", "Buchungsübersicht"],
    cta: "Jetzt starten", highlighted: false,
  },
  {
    name: "Grow", price: "59", desc: "Mehr Umsatz durch Automatisierung und No-Show-Schutz.",
    features: ["Alles aus Starter", "SMS-Erinnerungen", "No-Show-Schutz", "Umsatz-Dashboard", "Bis zu 5 Mitarbeiter"],
    cta: "Grow wählen", highlighted: true,
  },
  {
    name: "Pro", price: "99", desc: "Für etablierte Salons mit mehreren Mitarbeitern.",
    features: ["Alles aus Grow", "Unbegrenzte Mitarbeiter", "CRM & Kundenhistorie", "Provision-Tracking", "Prioritäts-Support"],
    cta: "Pro wählen", highlighted: false,
  },
  {
    name: "Business", price: "199", desc: "Für Ketten & Franchises mit mehreren Standorten.",
    features: ["Alles aus Pro", "Mehrere Standorte", "Zentrales Dashboard", "API-Zugang", "Account Manager"],
    cta: "Kontakt aufnehmen", highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="preise" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Faire Preise. Keine Überraschungen.</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Alle Pläne inklusive 14-tägiger Testphase. Monatlich kündbar.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-6 flex flex-col ${plan.highlighted ? "bg-black text-white ring-2 ring-black" : "border border-gray-200"}`}>
              {plan.highlighted && (
                <div className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Beliebtester Plan</div>
              )}
              <div className="mb-4">
                <div className="font-black text-2xl">{plan.name}</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black">{plan.price}€</span>
                  <span className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>/Monat</span>
                </div>
                <p className={`text-sm mt-2 leading-relaxed ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 ${plan.highlighted ? "text-green-400" : "text-green-600"}`}>✓</span>
                    <span className={plan.highlighted ? "text-gray-300" : "text-gray-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className={`block text-center font-semibold py-3 rounded-xl text-sm transition-all ${plan.highlighted ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Bereit loszulegen?</h2>
        <p className="text-lg text-gray-400 mb-8">
          Über 500 Salons vertrauen bereits auf Fades. Starte noch heute — kostenlos, ohne Kreditkarte.
        </p>
        <Link href="/auth/register" className="inline-flex items-center bg-white text-black font-semibold px-10 py-4 rounded-xl hover:bg-gray-100 transition-all text-base">
          Jetzt kostenlos starten →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-gray-500 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white font-black text-xl">fades.</div>
        <div className="text-sm">© 2025 Fades · Entwickelt für den deutschen Markt</div>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="hover:text-white transition-colors">Datenschutz</Link>
          <Link href="#" className="hover:text-white transition-colors">Impressum</Link>
          <Link href="#" className="hover:text-white transition-colors">AGB</Link>
        </div>
      </div>
    </footer>
  );
}
