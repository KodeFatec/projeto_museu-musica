import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CassetteCardComponent } from './cassette-card/cassette-card.component';
import { CdCardComponent } from './cd-card/cd-card.component';
import { LibrarySectionComponent } from './library-section/library-section.component';
import { TrackCardComponent } from './track-card/track-card.component';
import { VinylCardComponent } from './vinyl-card/vinyl-card.component';
import { VinylSleeveCardComponent } from './vinyl-sleeve-card/vinyl-sleeve-card.component';

/**
 * Cards de música (vinil, luva, fita K7 e CD) e a seção em carrossel/grade.
 * Usados pelas telas Início e Perfil (Minha Biblioteca).
 */
@NgModule({
  declarations: [
    LibrarySectionComponent, TrackCardComponent,
    VinylCardComponent, VinylSleeveCardComponent, CassetteCardComponent, CdCardComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [LibrarySectionComponent, TrackCardComponent],
})
export class TrackCardsModule {}
