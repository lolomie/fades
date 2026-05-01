import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { salon: true },
    });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten.' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account deaktiviert.' }, { status: 403 });
    }

    const token = signToken({ userId: user.id, salonId: user.salonId, role: user.role });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        salonName: user.salon.name,
        salonSlug: user.salon.slug,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Anmeldung fehlgeschlagen.' }, { status: 500 });
  }
}
