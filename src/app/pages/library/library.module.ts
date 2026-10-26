import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CassetteCardComponent } from './components/cassette-card/cassette-card.component';
import { LibrarySectionComponent } from './components/library-section/library-section.component';
import { TrackCardComponent } from './components/track-card/track-card.component';
import { VinylCardComponent } from './components/vinyl-card/vinyl-card.component';
import { VinylSleeveCardComponent } from './components/vinyl-sleeve-card/vinyl-sleeve-card.component';
import { LibraryComponent } from './library.component';

/** Tela Início (Minha Biblioteca), carregada sob demanda. */
@NgModule({
  declarations: [
    LibraryComponent, LibrarySectionComponent, TrackCardComponent,
    VinylCardComponent, VinylSleeveCardComponent, CassetteCardComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild([{ path: '', component: LibraryComponent }])],
})
export class LibraryModule {}
