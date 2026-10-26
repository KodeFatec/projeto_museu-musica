import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LyricsComponent } from './components/lyrics/lyrics.component';
import { ParticipantsListComponent } from './components/participants-list/participants-list.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { PlayerHeaderComponent } from './components/player-header/player-header.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { ScorePlateComponent } from './components/score-plate/score-plate.component';
import { TrackActionsComponent } from './components/track-actions/track-actions.component';
import { TrackInfoComponent } from './components/track-info/track-info.component';
import { TrackMediaComponent } from './components/track-media/track-media.component';
import { ViewTabsComponent } from './components/view-tabs/view-tabs.component';
import { NowPlayingComponent } from './now-playing.component';

/** Tela Tocando, carregada sob demanda. */
@NgModule({
  declarations: [
    NowPlayingComponent, PlayerHeaderComponent, TrackMediaComponent, TrackInfoComponent, QrCodeComponent,
    LyricsComponent, ScorePlateComponent, ParticipantsListComponent, ViewTabsComponent,
    PlayerBarComponent, ProgressBarComponent, PlaybackControlsComponent, TrackActionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: NowPlayingComponent },
      { path: ':id', component: NowPlayingComponent },
    ]),
    SharedModule,
  ],
})
export class NowPlayingModule {}
