import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { cassetteOf, formatByYear, vinylLabelOf } from '../../../../core/utils/media-format';

/**
 * Mídia da faixa: vinil até 1979, fita K7 a partir de 1980 (regra única em media-format.ts).
 * Clicar na mídia pausa/retoma.
 */
@Component({
  selector: 'app-track-media',
  standalone: false,
  templateUrl: './track-media.component.html',
  styleUrl: './track-media.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMediaComponent {
  readonly track = input.required<Track>();
  readonly playing = input(false);
  readonly toggle = output<void>();

  protected readonly format = computed(() => formatByYear(this.track().year));
  protected readonly label = computed(() => vinylLabelOf(this.track()));
  protected readonly spec = computed(() => cassetteOf(this.track()));
}
