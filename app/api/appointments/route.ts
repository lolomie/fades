import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0];

    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);

    const appointments = await prisma.appointment.findMany({
      where: { salonId, startsAt: { gte: start, lte: end } },
      include: { customer: true, employee: true, service: true },
      orderBy: { startsAt: 'asc' },
    });

    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Termine.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);
    const { customerId, employeeId, serviceId, startsAt, notes } = await req.json();

    const service = await prisma.service.findFirst({ where: { id: serviceId, salonId } });
    if (!service) return NextResponse.json({ error: 'Service nicht gefunden.' }, { status: 404 });

    const endsAt = new Date(new Date(startsAt).getTime() + service.durationMin * 60000);

    const appointment = await prisma.appointment.create({
      data: {
        salonId, customerId, employeeId, serviceId,
        startsAt: new Date(startsAt), endsAt,
        price: service.price, notes,
      },
      include: { customer: true, employee: true, service: true },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Termin konnte nicht erstellt werden.' }, { status: 500 });
  }
}
