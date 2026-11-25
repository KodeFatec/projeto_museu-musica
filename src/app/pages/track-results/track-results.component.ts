import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CassetteSpec, MediaFormat, VinylLabel } from '../../core/models/media.model';
import { fromQueryParams } from '../../core/models/explore-query.model';
import { Track } from '../../core/models/track.model';
import { CatalogService } from '../../core/services/catalog.service';
import { PlayerService } from '../../core/services/player.service';
import { cassetteOf, formatByYear, vinylLabelOf } from '../../core/utils/media-format';
import { formatClock } from '../../core/utils/time';

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

@Component({
  selector: 'app-track-results',
  standalone: false,
  templateUrl: './track-results.component.html',
  styleUrl: './track-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackResultsComponent implements OnInit {
  protected readonly catalog = inject(CatalogService);
  protected readonly player = inject(PlayerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly query = signal(fromQueryParams(this.route.snapshot.queryParamMap));

  protected readonly tracks = computed(() => {
    const criteria = this.query();
    const q = normalize(criteria.q?.trim() ?? '');
    if (criteria.tipo && criteria.tipo !== 'musicas') return [];
    return this.catalog.tracks().filter((track) => {
      const searchable = normalize([
        track.title,
        track.genre ?? '',
        track.isrc ?? '',
        ...track.artists.map((artist) => artist.name),
      ].join(' '));
      const matchesText = !q || searchable.includes(q);
      const matchesDecade = !criteria.decada ||
        (track.year !== null && track.year >= criteria.decada && track.year < criteria.decada + 10);
      const matchesFormat = !criteria.formato || formatByYear(track.year) === criteria.formato;
      return matchesText && matchesDecade && matchesFormat;
    });
  });

  protected readonly heading = computed(() => {
    const criteria = this.query();
    if (criteria.tipo && criteria.tipo !== 'musicas') return 'Resultados do acervo';
    if (criteria.q) return 'Resultados para “' + criteria.q + '”';
    if (criteria.decada) return 'Músicas da década de ' + criteria.decada;
    if (criteria.formato === 'vinyl') return 'Músicas em discos de vinil';
    if (criteria.formato === 'cassette') return 'Músicas em fitas K7';
    if (criteria.formato === 'cd') return 'Músicas em CD';
    return 'Músicas do Acervo Histórico';
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => this.query.set(fromQueryParams(params)));
    void this.catalog.load();
  }

  protected artistNames(track: Track): string {
    return track.artists.map((artist) => artist.name).join(', ');
  }

  protected formatLabel(track: Track): string {
    const format = formatByYear(track.year);
    return format === 'vinyl' ? 'Vinil' : format === 'cassette' ? 'Fita K7' : 'CD';
  }

  protected formatOf(track: Track): MediaFormat {
    return formatByYear(track.year);
  }

  protected labelOf(track: Track): VinylLabel {
    return vinylLabelOf(track);
  }

  protected cassetteSpec(track: Track): CassetteSpec {
    return cassetteOf(track);
  }

  protected duration(track: Track): string {
    return formatClock(track.durationSeconds);
  }

  protected isPlaying(track: Track): boolean {
    return this.player.track()?.id === track.id && this.player.playing();
  }

  protected toggleTrack(track: Track): void {
    if (this.player.track()?.id === track.id) {
      this.player.toggle();
      return;
    }

    this.play(track);
  }

  protected play(track: Track): void {
    void this.player.open(track.id, true);
    void this.router.navigate(['/tocando', track.id]);
  }

  protected clearSearch(): void {
    void this.router.navigate(['/descobrir']);
  }
}
