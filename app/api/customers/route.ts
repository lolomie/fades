import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';

    const customers = await prisma.customer.findMany({
      where: {
        salonId,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { lastVisit: 'desc' },
    });

    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Kunden.' }, { status: 500 });
  }
}
