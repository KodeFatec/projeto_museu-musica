import { Injectable, signal } from '@angular/core';

const KEY = 'museu.token';

/**
 * Guarda o JWT. "Manter conectado" usa o localStorage (sobrevive ao fechar o navegador);
 * sem isso, usa o sessionStorage (some ao fechar a aba). Separado do AuthService para o Axios poder ler o token.
 */
@Injectable({ providedIn: 'root' })
export class TokenStore {
  readonly token = signal<string | null>(this.read());

  set(token: string, remember: boolean): void {
    this.removeStored();
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, token);
    } catch {
      /* armazenamento indisponível: o login vale só até recarregar a página */
    }
    this.token.set(token);
  }

  clear(): void {
    this.removeStored();
    this.token.set(null);
  }

  private read(): string | null {
    try {
      return localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  private removeStored(): void {
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignora */
    }
  }
}
