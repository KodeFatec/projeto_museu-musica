import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { toApiError } from '../api/api-error';
import { HistoricoMusicaDto, MusicaFavoritaDto } from '../models/dto';
import { Track } from '../models/track.model';
import { FavoritesRepository, HistoryRepository } from '../repositories/user-library.repository';
import { formatByYear } from '../utils/media-format';
import { parseTime } from '../utils/time';
import { CatalogService, LoadStatus } from './catalog.service';

export type FormatFilter = 'all' | 'vinyl' | 'cassette';

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Biblioteca do usuário: favoritas (musica_favorita) e histórico (historico_musica) viram as 3 seções da tela. */
@Injectable({ providedIn: 'root' })
export class LibraryService {
  readonly userId = environment.currentUserId;

  readonly query = signal('');
  readonly filter = signal<FormatFilter>('all');
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);

  private readonly favorites = signal<MusicaFavoritaDto[]>([]);
  private readonly history = signal<HistoricoMusicaDto[]>([]);
  private loading?: Promise<void>;

  readonly likedIds = computed(() => new Set(this.favorites().map((f) => f.id_musica)));

  /** Músicas por número de reproduções (mais ouvidas primeiro). */
  readonly mostPlayedAll = computed(() => {
    const counts = new Map<number, number>();
    this.history().forEach((h) => counts.set(h.id_musica, (counts.get(h.id_musica) ?? 0) + 1));
    return this.tracksOf([...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id));
  });
  readonly likedAll = computed(() =>
    this.tracksOf([...this.favorites()].sort((a, b) => b.data_favoritada.localeCompare(a.data_favoritada)).map((f) => f.id_musica)),
  );
  private readonly recentAll = computed(() => {
    const ids = [...this.history()].sort((a, b) => b.data_reproducao.localeCompare(a.data_reproducao)).map((h) => h.id_musica);
    return this.tracksOf([...new Set(ids)]);
  });

  readonly mostPlayed = computed(() => this.visible(this.mostPlayedAll()).slice(0, 5));
  readonly recentlyPlayed = computed(() => this.visible(this.recentAll()).slice(0, 4));
  readonly liked = computed(() => this.visible(this.likedAll()).slice(0, 4));

  constructor(
    private readonly catalog: CatalogService,
    private readonly favoritesRepo: FavoritesRepository,
    private readonly historyRepo: HistoryRepository,
  ) {}

  load(): Promise<void> {
    return (this.loading ??= this.fetch());
  }

  async reload(): Promise<void> {
    this.loading = undefined;
    await this.catalog.reload();
    return this.load();
  }

  isLiked(songId: number): boolean {
    return this.likedIds().has(songId);
  }

  /** Último progresso salvo da música (segundos) para retomar de onde parou. */
  resumeAt(songId: number): number {
    const last = [...this.history()]
      .filter((h) => h.id_musica === songId && h.progresso)
      .sort((a, b) => b.data_reproducao.localeCompare(a.data_reproducao))[0];
    return last ? parseTime(last.progresso) : 0;
  }

  addHistory(row: HistoricoMusicaDto): void {
    this.history.update((rows) => [...rows, row]);
  }

  /** Atualização otimista: a UI muda na hora e volta atrás se a API falhar. */
  async toggleFavorite(songId: number): Promise<void> {
    const wasLiked = this.isLiked(songId);
    const before = this.favorites();
    this.favorites.set(
      wasLiked
        ? before.filter((f) => f.id_musica !== songId)
        : [...before, { id_usuario: this.userId, id_musica: songId, data_favoritada: new Date().toISOString().slice(0, 19).replace('T', ' ') }],
    );
    try {
      await (wasLiked ? this.favoritesRepo.remove(this.userId, songId) : this.favoritesRepo.add(this.userId, songId));
    } catch {
      this.favorites.set(before);
    }
  }

  private async fetch(): Promise<void> {
    this.status.set('loading');
    this.error.set(null);
    try {
      await this.catalog.load();
      if (this.catalog.status() === 'error') throw new Error(this.catalog.error() ?? 'Erro ao carregar o catálogo');
      const [favorites, history] = await Promise.all([
        this.favoritesRepo.listByUser(this.userId),
        this.historyRepo.listByUser(this.userId),
      ]);
      this.favorites.set(favorites);
      this.history.set(history);
      this.status.set('ready');
    } catch (e) {
      this.loading = undefined;
      this.error.set(toApiError(e).message);
      this.status.set('error');
    }
  }

  private tracksOf(ids: number[]): Track[] {
    return ids.map((id) => this.catalog.byId(id)).filter((t): t is Track => !!t);
  }

  private visible(tracks: Track[]): Track[] {
    const q = normalize(this.query().trim());
    const filter = this.filter();
    return tracks.filter((t) => {
      const matchesQuery = !q || normalize(`${t.title} ${t.artists.map((a) => a.name).join(' ')} ${t.genre ?? ''}`).includes(q);
      return matchesQuery && (filter === 'all' || formatByYear(t.year) === filter);
    });
  }
}
