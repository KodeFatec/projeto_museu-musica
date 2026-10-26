import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from '../../core/models/track.model';
import { FormatFilter, LibraryService } from '../../core/services/library.service';
import { PlayerService } from '../../core/services/player.service';

/** Tela "Início" (Minha Biblioteca): mais ouvidas e recentes (historico_musica) e curtidas (musica_favorita). */
@Component({
  selector: 'app-library',
  standalone: false,
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent implements OnInit {
  protected readonly library = inject(LibraryService);
  private readonly player = inject(PlayerService);
  private readonly router = inject(Router);

  protected readonly filters: { id: FormatFilter; label: string }[] = [
    { id: 'all', label: 'Todos os Formatos' },
    { id: 'vinyl', label: 'Vinis (LP/EP)' },
    { id: 'cassette', label: 'Fitas K7' },
  ];

  ngOnInit(): void {
    void this.library.load();
  }

  protected onSearch(event: Event): void {
    this.library.query.set((event.target as HTMLInputElement).value);
  }

  /** Clique no card: abre a tela Tocando já reproduzindo. */
  protected play(track: Track): void {
    void this.player.open(track.id, true);
    void this.router.navigate(['/tocando', track.id]);
  }
}
