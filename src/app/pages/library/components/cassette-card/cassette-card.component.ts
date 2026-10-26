import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { cassetteOf } from '../../../../core/utils/media-format';
import { artistLine } from '../../../../core/utils/track-presenter';

@Component({
  selector: 'app-cassette-card',
  standalone: false,
  templateUrl: './cassette-card.component.html',
  styleUrl: './cassette-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CassetteCardComponent {
  readonly track = input.required<Track>();
  protected readonly spec = computed(() => cassetteOf(this.track()));
  protected readonly artists = computed(() => artistLine(this.track()));
}
