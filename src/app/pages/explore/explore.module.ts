import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TrackCardsModule } from '../library/components/track-cards.module';
import { MuseumBannerModule } from '../home/components/museum-banner/museum-banner.module';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { PhysicalCardComponent } from './components/physical-card/physical-card.component';
import { ExploreComponent } from './explore.component';

/** Tela Descobrir (coleções e busca do acervo), carregada sob demanda. */
@NgModule({
  declarations: [ExploreComponent, CollectionCardComponent, PhysicalCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    TrackCardsModule, // só para a seção em carrossel/grade (app-library-section)
    MuseumBannerModule,
    RouterModule.forChild([{ path: '', component: ExploreComponent }]),
  ],
})
export class ExploreModule {}
