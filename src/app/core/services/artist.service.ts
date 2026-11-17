import { computed, Injectable, signal } from '@angular/core';
import { toApiError } from '../api/api-error';
import { toEvent } from '../mappers/event.mapper';
import { toArtistProfile } from '../mappers/artist.mapper';
import { ArtistProfile, ArtistStats } from '../models/artist.model';
import { MuseumEvent } from '../models/event.model';
import { Track } from '../models/track.model';
import { CatalogRepository } from '../repositories/catalog.repository';
import { MuseumRepository } from '../repositories/museum.repository';
import { formatByYear } from '../utils/media-format';
import { CatalogService, LoadStatus } from './catalog.service';
import { LibraryService } from './library.service';

/** Estado da tela do artista: ficha (artista), obras (musica_artista) e eventos (atividade). */
@Injectable({ providedIn: 'root' })
export class ArtistService {
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly profile = signal<ArtistProfile | null>(null);
  readonly events = signal<MuseumEvent[]>([]);

  private readonly artistId = signal<number | null>(null);

  /** Obras do artista: as mais ouvidas primeiro, depois as mais antigas. */
  readonly tracks = computed<Track[]>(() => {
    const id = this.artistId();
    const rank = new Map(this.library.mostPlayedAll().map((t, i) => [t.id, i]));
    return this.catalog
      .tracks()
      .filter((t) => t.artists.some((a) => a.id === id))
      .sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity) || (a.year ?? 0) - (b.year ?? 0));
  });

  readonly genres = computed(() => [...new Set(this.tracks().map((t) => t.genre).filter((g): g is string => !!g))]);

  readonly stats = computed<ArtistStats>(() => {
    const stats: ArtistStats = { works: this.tracks().length, vinyl: 0, cassette: 0, cd: 0 };
    for (const track of this.tracks()) stats[formatByYear(track.year)]++;
    return stats;
  });

  constructor(
    private readonly catalog: CatalogService,
    private readonly library: LibraryService,
    private readonly catalogRepository: CatalogRepository,
    private readonly museumRepository: MuseumRepository,
  ) {}

  async load(id: number): Promise<void> {
    if (this.artistId() === id && this.status() === 'ready') return;
    this.artistId.set(id);
    this.status.set('loading');
    this.error.set(null);
    this.profile.set(null);
    this.events.set([]);

    try {
      await Promise.all([this.catalog.load(), this.library.load()]);
      const dto = await this.catalogRepository.getArtist(id);
      if (this.artistId() !== id) return; // o usuário já abriu outro artista
      this.profile.set(toArtistProfile(dto));
      this.status.set('ready');
    } catch (e) {
      if (this.artistId() !== id) return;
      this.error.set(toApiError(e).message);
      this.status.set('error');
      return;
    }

    // eventos são opcionais (rota ainda planejada): se falhar, a linha do tempo fica vazia
    try {
      const activities = await this.museumRepository.listArtistActivities(id);
      if (this.artistId() === id) {
        this.events.set(
          activities.map(toEvent).sort((a, b) => (b.startDate?.getTime() ?? 0) - (a.startDate?.getTime() ?? 0)),
        );
      }
    } catch {
      /* sem eventos */
    }
  }
}
