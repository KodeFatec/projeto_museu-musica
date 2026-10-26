import { computed, Injectable, signal } from '@angular/core';
import { toTrack } from '../mappers/track.mapper';
import { Track } from '../models/track.model';
import { CatalogRepository } from '../repositories/catalog.repository';
import { toApiError } from '../api/api-error';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Catálogo de músicas já montado (música + gênero + artistas), carregado uma vez. */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly tracks = signal<Track[]>([]);
  private readonly index = computed(() => new Map(this.tracks().map((t) => [t.id, t])));
  private loading?: Promise<void>;

  constructor(private readonly repository: CatalogRepository) {}

  byId(id: number): Track | undefined {
    return this.index().get(id);
  }

  /** Idempotente: várias chamadas reaproveitam a mesma requisição. */
  load(): Promise<void> {
    return (this.loading ??= this.fetch());
  }

  reload(): Promise<void> {
    this.loading = undefined;
    return this.load();
  }

  private async fetch(): Promise<void> {
    this.status.set('loading');
    this.error.set(null);
    try {
      const [songs, genres, artists, links] = await Promise.all([
        this.repository.listSongs(),
        this.optionalList(this.repository.listGenres()),
        this.repository.listArtists(),
        this.optionalList(this.repository.listSongArtists()),
      ]);
      const genreMap = new Map(genres.map((g) => [g.id_genero, g]));
      const artistMap = new Map(artists.map((a) => [a.id_artista, a]));
      this.tracks.set(songs.map((s) => toTrack(s, genreMap, artistMap, links)));
      this.status.set('ready');
    } catch (e) {
      this.loading = undefined;
      this.error.set(toApiError(e).message);
      this.status.set('error');
    }
  }

  private async optionalList<T>(request: Promise<T[]>): Promise<T[]> {
    try {
      return await request;
    } catch (e) {
      const error = toApiError(e);
      if (error.status === 404) return [];
      throw e;
    }
  }
}
