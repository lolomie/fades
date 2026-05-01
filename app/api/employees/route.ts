import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);

    const employees = await prisma.user.findMany({
      where: { salonId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        color: true,
        createdAt: true,
      },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json({ employees });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Mitarbeiter.' }, { status: 500 });
  }
}
