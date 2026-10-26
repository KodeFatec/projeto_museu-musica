import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LibraryService } from '../../../../core/services/library.service';
import { PlayerService } from '../../../../core/services/player.service';

/** Favoritar a música (musica_favorita). */
@Component({
  selector: 'app-track-actions',
  standalone: false,
  templateUrl: './track-actions.component.html',
  styleUrl: './track-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackActionsComponent {
  protected readonly player = inject(PlayerService);
  private readonly library = inject(LibraryService);

  protected toggleFavorite(): void {
    const track = this.player.track();
    if (track) void this.library.toggleFavorite(track.id);
  }
}
