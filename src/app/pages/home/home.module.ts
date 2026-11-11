import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TrackCardsModule } from '../library/components/track-cards.module';
import { ArtistAvatarComponent } from './components/artist-avatar/artist-avatar.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { MuseumBannerComponent } from './components/museum-banner/museum-banner.component';
import { HomeComponent } from './home.component';

/** Tela Início (eventos, artistas, seleção do acervo e museu), carregada sob demanda. */
@NgModule({
  declarations: [
    HomeComponent, EventCardComponent, EventListComponent, ArtistAvatarComponent, MuseumBannerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TrackCardsModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
})
export class HomeModule {}
