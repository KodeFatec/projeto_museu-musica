import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArtistProfile, ArtistStats } from '../../../../core/models/artist.model';
import { ageBetween } from '../../../../core/utils/date-format';

/** Ficha do artista: foto, nomes, vida, gêneros, biografia, números do acervo e botão de ouvir. */
@Component({
  selector: 'app-artist-hero',
  standalone: false,
  templateUrl: './artist-hero.component.html',
  styleUrl: './artist-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistHeroComponent {
  readonly profile = input.required<ArtistProfile>();
  readonly genres = input<string[]>([]);
  readonly stats = input.required<ArtistStats>();
  readonly canListen = input(false);
  readonly listen = output<void>();

  /** "#ART-042" */
  protected readonly code = computed(() => `#ART-${String(this.profile().id).padStart(3, '0')}`);
  protected readonly initials = computed(() =>
    this.profile().name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
  );

  /** "1947 — 2020 • 72 anos" (ou "Desde 1947 • 78 anos" se ainda vive). */
  protected readonly life = computed(() => {
    const { birthDate, deathDate } = this.profile();
    if (!birthDate) return deathDate ? `Falecido em ${deathDate.getFullYear()}` : '';
    const age = ageBetween(birthDate, deathDate ?? new Date());
    const years = deathDate ? `${birthDate.getFullYear()} — ${deathDate.getFullYear()}` : `Desde ${birthDate.getFullYear()}`;
    return `${years} • ${age} anos`;
  });

  /** Só mostra os formatos em que o artista tem obras. */
  protected readonly numbers = computed(() => {
    const s = this.stats();
    return [
      { label: 'Obras registradas', value: s.works },
      { label: 'Vinis', value: s.vinyl },
      { label: 'Fitas K7', value: s.cassette },
      { label: 'CDs', value: s.cd },
    ].filter((n, i) => i === 0 || n.value > 0);
  });

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
