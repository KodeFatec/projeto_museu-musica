import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { vinylLabelOf } from '../../../../core/utils/media-format';
import { artistLine } from '../../../../core/utils/track-presenter';

/** Card de CD (músicas de 1990 em diante). */
@Component({
  selector: 'app-cd-card',
  standalone: false,
  templateUrl: './cd-card.component.html',
  styleUrl: './cd-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdCardComponent {
  readonly track = input.required<Track>();
  readonly gold = input(false);
  protected readonly label = computed(() => vinylLabelOf(this.track()));
  protected readonly artists = computed(() => artistLine(this.track()));
}
