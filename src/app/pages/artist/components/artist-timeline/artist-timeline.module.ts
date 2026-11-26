import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtistTimelineComponent } from './artist-timeline.component';

/** Linha do tempo "Eventos & Memória": usada nas telas do artista e do instrumento. */
@NgModule({
  declarations: [ArtistTimelineComponent],
  imports: [CommonModule],
  exports: [ArtistTimelineComponent],
})
export class ArtistTimelineModule {}
