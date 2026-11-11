import { computed, Injectable, signal } from '@angular/core';
import { toApiError } from '../api/api-error';
import { toEvent, toMuseum, toRoom } from '../mappers/event.mapper';
import { ArtistSummary, Museum, MuseumEvent, MuseumRoom } from '../models/event.model';
import { Track } from '../models/track.model';
import { MuseumRepository } from '../repositories/museum.repository';
import { CatalogService, LoadStatus } from './catalog.service';
import { LibraryService } from './library.service';

const ARTISTS_SHOWN = 6;
const SELECTION_SHOWN = 10;

/** Estado da tela inicial: eventos (atividade), artistas, seleção do acervo e dados do museu. */
@Injectable({ providedIn: 'root' })
export class HomeService {
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);

  readonly events = signal<MuseumEvent[]>([]);
  readonly museum = signal<Museum | null>(null);
  readonly rooms = signal<MuseumRoom[]>([]);
  private loading?: Promise<void>;

  /** Artistas ligados a músicas (musica_artista), os mais ouvidos primeiro. */
  readonly artistsAll = computed<ArtistSummary[]>(() => {
    // posição de cada música no ranking de mais ouvidas; quem não foi ouvida fica no fim
    const rank = new Map(this.library.mostPlayedAll().map((t, i) => [t.id, i]));
    const byArtist = new Map<number, { summary: ArtistSummary; best: number }>();

    for (const track of this.catalog.tracks()) {
      const position = rank.get(track.id) ?? Number.MAX_SAFE_INTEGER;
      for (const artist of track.artists) {
        const entry = byArtist.get(artist.id);
        if (!entry) {
          byArtist.set(artist.id, {
            best: position,
            summary: { id: artist.id, name: artist.name, photoUrl: artist.photoUrl, trackCount: 1, genre: track.genre, topTrackId: track.id },
          });
        } else {
          entry.summary.trackCount++;
          if (position < entry.best) {
            entry.best = position;
            entry.summary.topTrackId = track.id;
            entry.summary.genre = track.genre ?? entry.summary.genre;
          }
        }
      }
    }
    return [...byArtist.values()]
      .sort((a, b) => a.best - b.best || b.summary.trackCount - a.summary.trackCount || a.summary.name.localeCompare(b.summary.name))
      .map((e) => e.summary);
  });
  readonly artists = computed(() => this.artistsAll().slice(0, ARTISTS_SHOWN));

  /** Seleção do acervo: o catálogo com a busca e o filtro de formato aplicados. */
  readonly selectionAll = computed<Track[]>(() => this.library.visible(this.catalog.tracks()));
  readonly selection = computed(() => this.selectionAll().slice(0, SELECTION_SHOWN));

  readonly totalCapacity = computed(() => this.rooms().reduce((sum, r) => sum + (r.capacity ?? 0), 0));

  constructor(
    private readonly catalog: CatalogService,
    private readonly library: LibraryService,
    private readonly repository: MuseumRepository,
  ) {}

  load(): Promise<void> {
    return (this.loading ??= this.fetch());
  }

  async reload(): Promise<void> {
    this.loading = undefined;
    await this.library.reload();
    return this.load();
  }

  private async fetch(): Promise<void> {
    this.status.set('loading');
    this.error.set(null);
    // o catálogo e a biblioteca falham a tela toda; eventos e museu são opcionais (rotas ainda planejadas)
    const optional = <T>(request: Promise<T>) => request.then((v) => v, () => null);
    try {
      const [, activities, museum, rooms] = await Promise.all([
        this.library.load(),
        optional(this.repository.listActivities()),
        optional(this.repository.getMuseum()),
        optional(this.repository.listRooms()),
      ]);
      if (this.library.status() === 'error') throw new Error(this.library.error() ?? 'Erro ao carregar o acervo');

      this.events.set(
        (activities ?? [])
          .map(toEvent)
          .sort((a, b) => (a.startDate?.getTime() ?? Infinity) - (b.startDate?.getTime() ?? Infinity)),
      );
      this.museum.set(museum ? toMuseum(museum) : null);
      this.rooms.set((rooms ?? []).map(toRoom));
      this.status.set('ready');
    } catch (e) {
      this.loading = undefined;
      this.error.set(toApiError(e).message);
      this.status.set('error');
    }
  }
}
