import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const comingSoon = () => import('./pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule);

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', loadChildren: () => import('./pages/library/library.module').then((m) => m.LibraryModule) },
  { path: 'tocando', loadChildren: () => import('./pages/now-playing/now-playing.module').then((m) => m.NowPlayingModule) },
  { path: 'descobrir', data: { title: 'Descobrir' }, loadChildren: comingSoon },
  { path: 'instrumentos', data: { title: 'Instrumentos' }, loadChildren: comingSoon },
  { path: 'perfil', data: { title: 'Perfil' }, loadChildren: comingSoon },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
