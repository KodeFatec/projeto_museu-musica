import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from '../../core/models/track.model';
import { ArtistService } from '../../core/services/artist.service';
import { PlayerService } from '../../core/services/player.service';

/** Tela do artista: /artista/:id (aberta ao clicar em um artista na tela Início). */
@Component({
  selector: 'app-artist',
  standalone: false,
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistComponent {
  protected readonly artist = inject(ArtistService);
  private readonly player = inject(PlayerService);
  private readonly router = inject(Router);

  protected readonly code = computed(() => `#ART-${String(this.artist.profile()?.id ?? 0).padStart(3, '0')}`);

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => void this.artist.load(Number(params.get('id'))));
  }

  /** Volta para a tela anterior; se a página foi aberta direto, vai para o Início. */
  protected goBack(): void {
    if ((globalThis.history?.length ?? 0) > 1) globalThis.history.back();
    else void this.router.navigate(['/inicio']);
  }

  /** Abre a tela Tocando já reproduzindo. */
  protected playTrack(track: Track): void {
    void this.player.open(track.id, true);
    void this.router.navigate(['/tocando', track.id]);
  }

  protected listen(): void {
    const first = this.artist.tracks()[0];
    if (first) this.playTrack(first);
  }
}
