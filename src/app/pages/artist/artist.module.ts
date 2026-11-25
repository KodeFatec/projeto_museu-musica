import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrackCardsModule } from '../library/components/track-cards.module';
import { ArtistComponent } from './artist.component';
import { ArtistHeroComponent } from './components/artist-hero/artist-hero.component';
import { ArtistTimelineModule } from './components/artist-timeline/artist-timeline.module';

/** Tela do artista, carregada sob demanda (/artista/:id). */
@NgModule({
  declarations: [ArtistComponent, ArtistHeroComponent],
  imports: [CommonModule, TrackCardsModule, ArtistTimelineModule, RouterModule.forChild([{ path: ':id', component: ArtistComponent }])],
})
export class ArtistModule {}
