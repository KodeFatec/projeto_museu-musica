import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { vinylLabelOf } from '../../../../core/utils/media-format';
import { artistLine } from '../../../../core/utils/track-presenter';

@Component({
  selector: 'app-vinyl-card',
  standalone: false,
  templateUrl: './vinyl-card.component.html',
  styleUrl: './vinyl-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VinylCardComponent {
  readonly track = input.required<Track>();
  protected readonly label = computed(() => vinylLabelOf(this.track()));
  protected readonly artists = computed(() => artistLine(this.track()));
}
