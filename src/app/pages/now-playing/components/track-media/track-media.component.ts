import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { LibraryService } from '../../../../core/services/library.service';
import { cassetteOf, formatByYear, vinylLabelOf } from '../../../../core/utils/media-format';

/**
 * Mídia da faixa: vinil até 1979, fita K7 de 1980 a 1989, CD a partir de 1990 (regra única em media-format.ts).
 * As músicas mais escutadas aparecem como disco de ouro.
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

  private readonly library = inject(LibraryService);
  protected readonly format = computed(() => formatByYear(this.track().year));
  protected readonly gold = computed(() => this.library.isGold(this.track().id));
  protected readonly label = computed(() => vinylLabelOf(this.track()));
  protected readonly spec = computed(() => cassetteOf(this.track()));
}
