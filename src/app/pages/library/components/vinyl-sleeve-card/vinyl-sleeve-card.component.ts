import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { sleeveColorOf, vinylLabelOf } from '../../../../core/utils/media-format';
import { artistLine } from '../../../../core/utils/track-presenter';

/** Vinil dentro da luva: no hover o disco desliza para fora. */
@Component({
  selector: 'app-vinyl-sleeve-card',
  standalone: false,
  templateUrl: './vinyl-sleeve-card.component.html',
  styleUrl: './vinyl-sleeve-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VinylSleeveCardComponent {
  readonly track = input.required<Track>();
  // o selo do disco na luva é liso (sem texto), só a cor
  protected readonly label = computed(() => ({ ...vinylLabelOf(this.track()), lines: [] }));
  protected readonly color = computed(() => sleeveColorOf(this.track()));
  protected readonly artists = computed(() => artistLine(this.track()));
  protected readonly mainArtist = computed(() => this.track().artists[0]?.name ?? 'Museu');
  protected readonly note = computed(() => this.track().description ?? '');
}
