import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { formatClock } from '../../../../core/utils/time';
import { artistLine } from '../../../../core/utils/track-presenter';

@Component({
  selector: 'app-track-info',
  standalone: false,
  templateUrl: './track-info.component.html',
  styleUrl: './track-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackInfoComponent {
  readonly track = input.required<Track>();

  protected readonly artists = computed(() => artistLine(this.track()));
  protected readonly duration = computed(() => formatClock(this.track().durationSeconds));
  protected readonly genreAndDuration = computed(() => [this.track().genre, this.duration()].filter(Boolean).join(' • '));
  /** Versão resumida (mobile): "ISRC … • Gênero • 04:45". */
  protected readonly pillParts = computed(() => {
    const t = this.track();
    return [t.isrc ? `ISRC ${t.isrc}` : null, t.genre ?? null, this.duration()].filter((p): p is string => !!p);
  });
}
