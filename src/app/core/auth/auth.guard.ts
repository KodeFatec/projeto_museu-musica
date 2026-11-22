import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Áreas só para quem fez login (Perfil): visitante vai para o login e volta depois. */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};

/** Login e cadastro: quem já está logado não precisa deles. */
export const guestGuard: CanActivateFn = () => (inject(AuthService).isLoggedIn() ? inject(Router).createUrlTree(['/perfil']) : true);
