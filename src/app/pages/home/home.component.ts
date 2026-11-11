import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ArtistSummary } from '../../core/models/event.model';
import { Track } from '../../core/models/track.model';
import { HomeService } from '../../core/services/home.service';
import { FormatFilter, LibraryService } from '../../core/services/library.service';
import { PlayerService } from '../../core/services/player.service';
import { UserService } from '../../core/services/user.service';

/**
 * Tela "Início": eventos (atividade), artistas, seleção do acervo (musica) e dados do museu.
 * Mobile: eventos em carrossel. Desktop: destaque + lista lateral.
 */
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  protected readonly home = inject(HomeService);
  protected readonly library = inject(LibraryService);
  protected readonly user = inject(UserService);
  private readonly player = inject(PlayerService);
  private readonly router = inject(Router);

  protected readonly filters: { id: FormatFilter; label: string }[] = [
    { id: 'all', label: 'Todos os Formatos' },
    { id: 'vinyl', label: 'Vinis' },
    { id: 'cassette', label: 'Fitas K7' },
    { id: 'cd', label: 'CDs' },
  ];

  private readonly slides = viewChild<ElementRef<HTMLElement>>('slides');
  private readonly requestedIndex = signal(0);
  /** Evento exibido (limitado ao tamanho da lista, que pode mudar ao recarregar). */
  protected readonly activeIndex = computed(() =>
    Math.min(this.requestedIndex(), Math.max(this.home.events().length - 1, 0)),
  );
  protected readonly initials = computed(() =>
    this.user.name().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
  );

  ngOnInit(): void {
    void this.home.load();
  }

  /** Carrossel mobile: o ponto ativo acompanha o scroll. */
  protected onSlidesScroll(): void {
    const el = this.slides()?.nativeElement;
    if (el && el.clientWidth > 0) this.requestedIndex.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  protected selectEvent(index: number): void {
    this.requestedIndex.set(index);
    const el = this.slides()?.nativeElement;
    el?.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  }

  protected stepEvent(delta: number): void {
    const total = this.home.events().length;
    if (total > 0) this.selectEvent((this.activeIndex() + delta + total) % total);
  }

  protected onSearch(query: string): void {
    this.library.query.set(query);
  }

  protected playTrack(track: Track): void {
    this.open(track.id);
  }

  protected playArtist(artist: ArtistSummary): void {
    this.open(artist.topTrackId);
  }

  /** Abre a tela Tocando já reproduzindo. */
  private open(trackId: number): void {
    void this.player.open(trackId, true);
    void this.router.navigate(['/tocando', trackId]);
  }
}
