import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrackCardsModule } from './components/track-cards.module';
import { LibraryComponent } from './library.component';

/** Tela Perfil (Minha Biblioteca), carregada sob demanda. */
@NgModule({
  declarations: [LibraryComponent],
  imports: [CommonModule, TrackCardsModule, RouterModule.forChild([{ path: '', component: LibraryComponent }])],
})
export class LibraryModule {}
