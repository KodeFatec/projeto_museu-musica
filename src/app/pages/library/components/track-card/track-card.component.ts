import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { LibraryService } from '../../../../core/services/library.service';
import { formatByYear } from '../../../../core/utils/media-format';

/**
 * Único ponto onde a regra "ano -> formato" decide o card:
 * até 1979 = vinil, 1980–1989 = fita K7, a partir de 1990 = CD (ver core/utils/media-format.ts).
 * As músicas mais escutadas ganham o disco de ouro.
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
      @case ('cd') {
        <app-cd-card [track]="track()" />
      }
    }
    @if (gold()) {
      <span class="seal" title="Disco de Ouro" role="img" aria-label="Disco de Ouro">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>
      </span>
    }
  `,
  styles: `
    :host { display: block; position: relative; }
    .seal {
      position: absolute; top: 0.3rem; right: 0.3rem; z-index: 4;
      width: 1.7rem; height: 1.7rem; display: grid; place-items: center; border-radius: 50%;
      color: var(--gold-700); border: 1.5px solid var(--gold-100);
      background: linear-gradient(135deg, var(--gold-200), var(--gold-500) 55%, var(--gold-600));
      box-shadow: 0 3px 8px rgba(138, 99, 30, 0.4); pointer-events: none;
    }
    .seal svg { width: 0.95rem; }
  `,
})
export class TrackCardComponent {
  readonly track = input.required<Track>();
  /** 'sleeve' mostra o vinil dentro da luva (seção Curtidas). */
  readonly variant = input<'default' | 'sleeve'>('default');
  readonly play = output<Track>();
  private readonly library = inject(LibraryService);
  protected readonly format = computed(() => formatByYear(this.track().year));
  protected readonly gold = computed(() => this.library.isGold(this.track().id));
}
