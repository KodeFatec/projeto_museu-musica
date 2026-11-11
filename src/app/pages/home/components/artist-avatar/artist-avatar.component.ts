import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArtistSummary } from '../../../../core/models/event.model';

/** Artista em círculo (foto_url ou iniciais). Clicar toca a música mais ouvida dele. */
@Component({
  selector: 'app-artist-avatar',
  standalone: false,
  templateUrl: './artist-avatar.component.html',
  styleUrl: './artist-avatar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistAvatarComponent {
  readonly artist = input.required<ArtistSummary>();
  /** Destaque (o artista mais ouvido): anel dourado e estrela. */
  readonly featured = input(false);
  readonly choose = output<ArtistSummary>();

  protected readonly initials = computed(() =>
    this.artist().name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
  );
  protected readonly count = computed(() => {
    const n = this.artist().trackCount;
    return `${n} ${n === 1 ? 'música' : 'músicas'}`;
  });
}
