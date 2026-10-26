import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { formatByYear } from '../../../../core/utils/media-format';

/**
 * Único ponto onde a regra "ano -> formato" decide o card:
 * até 1979 = vinil, a partir de 1980 = fita K7 (ver core/utils/media-format.ts).
 */
@Component({
  selector: 'app-track-card',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'play.emit(track())', '(keydown.enter)': 'play.emit(track())' },
  template: `
    @switch (format()) {
      @case ('vinyl') {
        @if (variant() === 'sleeve') {
          <app-vinyl-sleeve-card [track]="track()" />
        } @else {
          <app-vinyl-card [track]="track()" />
        }
      }
      @case ('cassette') {
        <app-cassette-card [track]="track()" />
      }
    }
  `,
  styles: ':host { display: block; }',
})
export class TrackCardComponent {
  readonly track = input.required<Track>();
  /** 'sleeve' mostra o vinil dentro da luva (seção Curtidas). */
  readonly variant = input<'default' | 'sleeve'>('default');
  readonly play = output<Track>();
  protected readonly format = computed(() => formatByYear(this.track().year));
}
