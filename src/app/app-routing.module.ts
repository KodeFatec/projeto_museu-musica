import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

const comingSoon = () => import('./pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule);

const auth = () => import('./pages/auth/auth.module').then((m) => m.AuthModule);

const routes: Routes = [
  // login e cadastro usam a mesma casca; `data.mode` escolhe o formulário
  { path: 'login', canActivate: [guestGuard], data: { mode: 'login' }, loadChildren: auth },
  { path: 'cadastro', canActivate: [guestGuard], data: { mode: 'register' }, loadChildren: auth },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule) },
  { path: 'artista', loadChildren: () => import('./pages/artist/artist.module').then((m) => m.ArtistModule) },
  // Perfil só para quem fez login: visitante vai para /login e volta depois
  { path: 'perfil', canActivate: [authGuard], loadChildren: () => import('./pages/library/library.module').then((m) => m.LibraryModule) },
  { path: 'tocando', loadChildren: () => import('./pages/now-playing/now-playing.module').then((m) => m.NowPlayingModule) },
  {
    path: 'descobrir',
    children: [
      // tela futura: recebe os critérios pela URL (veja core/models/explore-query.model.ts)
      { path: 'resultados', data: { title: 'Resultados da busca' }, loadChildren: comingSoon },
      { path: '', loadChildren: () => import('./pages/explore/explore.module').then((m) => m.ExploreModule) },
    ],
  },
  { path: 'instrumentos', loadChildren: () => import('./pages/instruments/instruments.module').then((m) => m.InstrumentsModule) },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
