import { computed, effect, inject, Injectable, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../api/api-error';
import { RegisterRequest } from '../models/dto';
import { AuthRepository } from '../repositories/auth.repository';
import { onlyDigits } from '../utils/cpf';
import { decodeJwt } from '../utils/jwt';
import { TokenStore } from './token.store';

/** Só aceita caminhos internos como destino depois do login (evita redirecionar para outro site). */
export function safeRedirect(url: string | null | undefined, fallback = '/inicio'): string {
  const ok = !!url && url.startsWith('/') && !url.startsWith('//') && !/^\/(login|cadastro)/.test(url);
  return ok ? url : fallback;
}

/** Sessão do usuário: login, cadastro, logout e o id do usuário vindo do JWT. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(TokenStore);
  private readonly repository = inject(AuthRepository);
  private readonly router = inject(Router);
  private expiryTimer?: ReturnType<typeof setTimeout>;

  /** usuario.id_usuario do token válido, ou null (visitante). */
  readonly userId = computed<string | number | null>(() => {
    const claims = decodeJwt(this.store.token());
    if (!claims) return null;
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null;
    const rawId = claims.sub ?? claims.id_usuario ?? claims.id;
    if (rawId === undefined || rawId === null) return null;
    const str = String(rawId).trim();
    return str.length > 0 ? str : null;
  });
  readonly isLoggedIn = computed(() => this.userId() !== null);

  constructor() {
    // token inválido ou vencido: descarta. Token válido: agenda o logout para a hora em que vence.
    effect(() => {
      const token = this.store.token();
      const loggedIn = this.isLoggedIn();
      untracked(() => {
        clearTimeout(this.expiryTimer);
        if (token && !loggedIn) {
          this.store.clear();
          return;
        }
        const exp = decodeJwt(token)?.exp;
        const delay = exp ? exp * 1000 - Date.now() : 0;
        if (delay > 0 && delay < 2_000_000_000) this.expiryTimer = setTimeout(() => this.store.clear(), delay);
      });
    });

    // a sessão acabou (logout ou token vencido) dentro de uma área restrita: vai para o login
    effect(() => {
      if (!this.isLoggedIn() && this.router.url.startsWith('/perfil')) {
        untracked(() => void this.router.navigate(['/login'], { queryParams: { redirect: '/perfil' } }));
      }
    });
  }

  async login(login: string, password: string, remember: boolean): Promise<void> {
    const typed = login.trim();
    // CPF vai só com dígitos; e-mail vai em minúsculas
    const normalized = /^[\d.\-\s]+$/.test(typed) ? onlyDigits(typed) : typed.toLowerCase();
    this.accept((await this.repository.login({ login: normalized, senha: password })).token, remember);
  }

  async register(data: RegisterRequest, remember = true): Promise<void> {
    const body: RegisterRequest = { ...data, cpf: onlyDigits(data.cpf), email: data.email.trim().toLowerCase(), nome: data.nome.trim() };
    if (!body.telefone?.trim()) delete body.telefone;
    this.accept((await this.repository.register(body)).token, remember);
  }

  logout(): void {
    this.store.clear();
    void this.router.navigate(['/inicio']);
  }

  /** Para ações que exigem login (ex.: favoritar): se for visitante, leva ao login e volta depois. */
  requireLogin(): boolean {
    if (this.isLoggedIn()) return true;
    void this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
    return false;
  }

  private accept(token: string, remember: boolean): void {
    this.store.set(token, remember);
    if (!this.isLoggedIn()) {
      this.store.clear();
      throw new ApiError('O servidor devolveu um token inválido', null);
    }
  }
}
