import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from '../../core/services/library.service';
import { PlayerService } from '../../core/services/player.service';
import { cassetteOf, formatByYear, vinylLabelOf } from '../../core/utils/media-format';
import { formatClock } from '../../core/utils/time';
import { artistLine } from '../../core/utils/track-presenter';

/** Player compacto: aparece em todas as telas, menos em "Tocando". Usa o mesmo PlayerService. */
@Component({
  selector: 'app-mini-player',
  standalone: false,
  templateUrl: './mini-player.component.html',
  styleUrl: './mini-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniPlayerComponent {
  protected readonly player = inject(PlayerService);
  private readonly library = inject(LibraryService);
  private readonly router = inject(Router);
  protected readonly track = this.player.track;
  protected readonly isVinyl = computed(() => formatByYear(this.track()?.year ?? null) === 'vinyl');
  protected readonly label = computed(() => (this.track() ? vinylLabelOf(this.track()!) : null));
  protected readonly spec = computed(() => (this.track() ? cassetteOf(this.track()!) : null));
  protected readonly artists = computed(() => (this.track() ? artistLine(this.track()!) : ''));

  protected time(seconds: number): string {
    return formatClock(seconds);
  }

  protected seek(event: Event): void {
    this.player.seek(Number((event.target as HTMLInputElement).value));
  }

  protected toggleFavorite(): void {
    const track = this.track();
    if (track) void this.library.toggleFavorite(track.id);
  }

  protected openPlayer(): void {
    const track = this.track();
    if (track) void this.router.navigate(['/tocando', track.id]);
  }
}
