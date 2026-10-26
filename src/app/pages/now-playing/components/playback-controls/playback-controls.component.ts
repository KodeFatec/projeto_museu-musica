import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlayerService } from '../../../../core/services/player.service';

@Component({
  selector: 'app-playback-controls',
  standalone: false,
  templateUrl: './playback-controls.component.html',
  styleUrl: './playback-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaybackControlsComponent {
  protected readonly player = inject(PlayerService);
}
