const KEY = 'fades_auth';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  salonName: string;
  salonSlug: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export function saveAuth(data: AuthData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getAuth(): AuthData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthData) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getToken(): string | null {
  return getAuth()?.token ?? null;
}
