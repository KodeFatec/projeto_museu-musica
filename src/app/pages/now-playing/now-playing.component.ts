import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { audioFormatOf, composersOf } from '../../core/utils/track-presenter';
import { ViewTab } from './components/view-tabs/view-tabs.component';

/** Tela "Tocando": /tocando (música atual) ou /tocando/:id (abre aquela música). */
@Component({
  selector: 'app-now-playing',
  standalone: false,
  templateUrl: './now-playing.component.html',
  styleUrl: './now-playing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingComponent {
  /** Abas do mobile: no desktop os três painéis aparecem lado a lado. */
  protected readonly tabs: ViewTab[] = [
    { id: 'lyrics', label: 'Letra Sincronizada', icon: 'M4 5h10M4 9h7M4 13h5M17 4v9.5M17 4l3 1.2M17 13.5a2 2 0 1 1-2-2 2 2 0 0 1 2 2Z' },
    { id: 'score', label: 'Partitura & Ficha', icon: 'M9 18V5l11-2v13M9 18a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 9 18Zm11-2a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 20 16Z' },
    { id: 'qr', label: 'QR Estação', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z' },
  ];
  protected readonly activeTab = signal('lyrics');

  protected readonly qrUrl = computed(() => `${globalThis.location?.origin ?? ''}/tocando/${this.player.track()?.id ?? ''}`);
  protected readonly composers = computed(() => (this.player.track() ? composersOf(this.player.track()!) : ''));
  protected readonly audioFormat = computed(() => (this.player.track() ? audioFormatOf(this.player.track()!) : null));
  protected readonly recordedIn = computed(() => {
    const year = this.player.track()?.year;
    return year ? `Gravado em ${year}` : '';
  });
  protected readonly hasArtifacts = computed(() => !!this.player.score() || (this.player.track()?.artists.length ?? 0) > 0);

  constructor(
    protected readonly player: PlayerService,
    private readonly location: Location,
    route: ActivatedRoute,
  ) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));
      if (params.get('id') && Number.isInteger(id)) void this.player.open(id);
      else if (!this.player.track()) void this.player.openDefault();
    });
  }

  protected goBack(): void {
    this.location.back();
  }
}
