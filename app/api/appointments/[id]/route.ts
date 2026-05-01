import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);
    const { id } = await params;
    const { status, cancelReason } = await req.json();

    const existing = await prisma.appointment.findFirst({ where: { id, salonId } });
    if (!existing) return NextResponse.json({ error: 'Termin nicht gefunden.' }, { status: 404 });

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        ...(status === 'CANCELLED' ? { cancelReason: cancelReason ?? null, cancelledAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ appointment });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren.' }, { status: 500 });
  }
}
