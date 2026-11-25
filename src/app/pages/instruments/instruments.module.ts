import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ArtistTimelineModule } from '../artist/components/artist-timeline/artist-timeline.module';
import { InstrumentCardComponent } from './components/instrument-card/instrument-card.component';
import { InstrumentFactsComponent } from './components/instrument-facts/instrument-facts.component';
import { InstrumentHeroComponent } from './components/instrument-hero/instrument-hero.component';
import { InstrumentLocationsComponent } from './components/instrument-locations/instrument-locations.component';
import { InstrumentMediaComponent } from './components/instrument-media/instrument-media.component';
import { InstrumentDetailComponent } from './instrument-detail.component';
import { InstrumentsComponent } from './instruments.component';

@NgModule({
  declarations: [
    InstrumentsComponent,
    InstrumentCardComponent,
    InstrumentDetailComponent,
    InstrumentHeroComponent,
    InstrumentFactsComponent,
    InstrumentMediaComponent,
    InstrumentLocationsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArtistTimelineModule, // linha do tempo "Eventos & Memória", a mesma da tela do artista
    RouterModule.forChild([
      { path: '', component: InstrumentsComponent },
      { path: ':id', component: InstrumentDetailComponent },
    ]),
  ],
})
export class InstrumentsModule {}
