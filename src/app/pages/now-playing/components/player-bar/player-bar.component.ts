import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { artistLine } from '../../../../core/utils/track-presenter';

/** Barra do player: progresso + controles + favoritar. Fixa embaixo no desktop; inline no mobile. */
@Component({
  selector: 'app-player-bar',
  standalone: false,
  templateUrl: './player-bar.component.html',
  styleUrl: './player-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerBarComponent {
  readonly track = input.required<Track>();
  protected readonly artists = computed(() => artistLine(this.track()));
}
