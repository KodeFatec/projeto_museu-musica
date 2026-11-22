/** Campos do JWT que o app usa. O backend define o resto. */
export interface JwtClaims {
  /** usuario.id_usuario (também aceitamos id_usuario ou id). */
  sub?: string | number;
  id_usuario?: string | number;
  id?: string | number;
  /** Expiração, em segundos desde 1970. */
  exp?: number;
  [claim: string]: unknown;
}

/** Lê o payload de um JWT (só decodifica; quem confere a assinatura é o backend). */
export function decodeJwt(token: string | null | undefined): JwtClaims | null {
  const payload = token?.split('.')[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const bytes = atob(base64);
    const json = decodeURIComponent(Array.from(bytes, (c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}
