import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env') });

const ADMIN_EMAIL = 'admin@fades.de';
const ADMIN_PASSWORD = 'Fades2025!';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Seeding Fades database...');

  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log('✓ Admin bereits vorhanden — überspringe Seed.');
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const empHash = await bcrypt.hash('Mitarbeiter123!', 12);

  const salon = await prisma.salon.create({
    data: {
      name: 'Fades Demo Salon',
      slug: 'demo-salon',
      email: ADMIN_EMAIL,
      phone: '+49 30 12345678',
      address: 'Musterstraße 1',
      city: 'Berlin',
      postalCode: '10115',
      plan: 'GROW',
      users: {
        create: [
          { email: ADMIN_EMAIL, passwordHash, firstName: 'Admin', lastName: 'Fades', role: 'OWNER', color: '#000000' },
          { email: 'ahmed@fades.de', passwordHash: empHash, firstName: 'Ahmed', lastName: 'Yilmaz', role: 'EMPLOYEE', color: '#3B82F6' },
          { email: 'marco@fades.de', passwordHash: empHash, firstName: 'Marco', lastName: 'Rossi', role: 'EMPLOYEE', color: '#10B981' },
        ],
      },
      services: {
        create: [
          { name: 'Haarschnitt', description: 'Klassischer Herrenhaarschnitt inkl. Styling', durationMin: 30, price: 25, color: '#000000', sortOrder: 1 },
          { name: 'Fade + Bartpflege', description: 'Skin Fade mit Bartschnitt und Konturierung', durationMin: 45, price: 38, color: '#374151', sortOrder: 2 },
          { name: 'Bart trimmen', description: 'Bartpflege, Konturierung & Styling', durationMin: 20, price: 18, color: '#6B7280', sortOrder: 3 },
          { name: 'Komplettpaket', description: 'Haarschnitt + Fade + Bart + Augenbrauen', durationMin: 60, price: 55, color: '#111827', sortOrder: 4 },
        ],
      },
    },
    include: { users: true, services: true },
  });

  // Arbeitszeiten (Mo–Sa 09:00–18:00)
  const wh: { userId: string; dayOfWeek: number; startTime: string; endTime: string }[] = [];
  for (const emp of salon.users) {
    for (let day = 0; day <= 5; day++) {
      wh.push({ userId: emp.id, dayOfWeek: day, startTime: '09:00', endTime: '18:00' });
    }
  }
  await prisma.workingHour.createMany({ data: wh });

  // Demo-Kunden
  const customers = await prisma.customer.createManyAndReturn({
    data: [
      { salonId: salon.id, firstName: 'Kemal', lastName: 'Demir', email: 'kemal@example.de', gdprConsent: true, gdprConsentDate: new Date(), visitCount: 5 },
      { salonId: salon.id, firstName: 'Jonas', lastName: 'Bauer', email: 'jonas@example.de', gdprConsent: true, gdprConsentDate: new Date(), visitCount: 3 },
      { salonId: salon.id, firstName: 'Luca', lastName: 'Ricci', email: 'luca@example.de', gdprConsent: true, gdprConsentDate: new Date(), visitCount: 2 },
    ],
  });

  // Heutige Demo-Termine
  const owner = salon.users.find(u => u.role === 'OWNER')!;
  const ahmed = salon.users.find(u => u.firstName === 'Ahmed')!;
  const svc1 = salon.services.find(s => s.name === 'Haarschnitt')!;
  const svc2 = salon.services.find(s => s.name === 'Fade + Bartpflege')!;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.appointment.createMany({
    data: [
      { salonId: salon.id, customerId: customers[0].id, employeeId: owner.id, serviceId: svc2.id, startsAt: new Date(today.getTime() + 9 * 3600000), endsAt: new Date(today.getTime() + 9.75 * 3600000), status: 'CONFIRMED', price: 38 },
      { salonId: salon.id, customerId: customers[1].id, employeeId: ahmed.id, serviceId: svc1.id, startsAt: new Date(today.getTime() + 10 * 3600000), endsAt: new Date(today.getTime() + 10.5 * 3600000), status: 'COMPLETED', price: 25 },
      { salonId: salon.id, customerId: customers[2].id, employeeId: owner.id, serviceId: svc1.id, startsAt: new Date(today.getTime() + 11 * 3600000), endsAt: new Date(today.getTime() + 11.5 * 3600000), status: 'CONFIRMED', price: 25 },
    ],
  });

  console.log('\n✅ Seed abgeschlossen!');
  console.log('─────────────────────────────────');
  console.log(`Salon:       Fades Demo Salon`);
  console.log(`Buchungs-URL: /booking/demo-salon`);
  console.log(`Admin-Login: ${ADMIN_EMAIL}`);
  console.log(`Passwort:    ${ADMIN_PASSWORD}`);
  console.log('─────────────────────────────────');

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
