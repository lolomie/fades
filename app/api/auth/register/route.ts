import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { salonName, ownerName, email, password, phone, plan } = await req.json();

    if (!salonName || !ownerName || !email || !password) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'E-Mail bereits registriert.' }, { status: 409 });
    }

    const slug = salonName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const [firstName, ...rest] = ownerName.trim().split(' ');
    const lastName = rest.join(' ') || '-';

    const passwordHash = await bcrypt.hash(password, 12);

    const planMap: Record<string, 'STARTER' | 'GROW' | 'PRO' | 'BUSINESS'> = {
      starter: 'STARTER', grow: 'GROW', pro: 'PRO', business: 'BUSINESS',
    };

    const salon = await prisma.salon.create({
      data: {
        name: salonName,
        slug: `${slug}-${Date.now()}`,
        email,
        phone,
        plan: planMap[plan] ?? 'STARTER',
        users: {
          create: {
            email,
            passwordHash,
            firstName,
            lastName,
            phone,
            role: 'OWNER',
          },
        },
        services: {
          create: [
            { name: 'Haarschnitt', description: 'Klassischer Herrenhaarschnitt', durationMin: 30, price: 25, color: '#000000' },
            { name: 'Fade + Bartpflege', description: 'Skin Fade mit Bartschnitt', durationMin: 45, price: 38, color: '#374151' },
            { name: 'Bart trimmen', description: 'Bartpflege & Styling', durationMin: 20, price: 18, color: '#6B7280' },
          ],
        },
      },
      include: { users: true },
    });

    const owner = salon.users[0];
    const token = signToken({ userId: owner.id, salonId: salon.id, role: owner.role });

    return NextResponse.json({ token, salonSlug: salon.slug }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 });
  }
}
