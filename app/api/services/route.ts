import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);

    const services = await prisma.service.findMany({
      where: { salonId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Services.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

    const { salonId } = verifyToken(token);
    const body = await req.json();

    const service = await prisma.service.create({
      data: { ...body, salonId },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Service konnte nicht erstellt werden.' }, { status: 500 });
  }
}
