import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlayerService } from '../../../../core/services/player.service';
import { formatClock } from '../../../../core/utils/time';

@Component({
  selector: 'app-progress-bar',
  standalone: false,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  protected readonly player = inject(PlayerService);

  protected time(seconds: number): string {
    return formatClock(seconds);
  }

  protected onSeek(event: Event): void {
    this.player.seek(Number((event.target as HTMLInputElement).value));
  }
}
