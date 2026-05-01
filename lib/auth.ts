import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fades-dev-secret-change-in-production';

export function signToken(payload: { userId: string; salonId: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; salonId: string; role: string };
}
