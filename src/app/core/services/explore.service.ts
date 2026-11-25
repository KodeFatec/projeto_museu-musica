import { computed, inject, Injectable, signal } from '@angular/core';
import { toTrack } from '../mappers/track.mapper';
import { ColecaoDto } from '../models/dto';
import { ExploreQuery, SearchScope } from '../models/explore-query.model';
import { MediaFormat } from '../models/media.model';
import { Track } from '../models/track.model';
import { CatalogRepository } from '../repositories/catalog.repository';
import { SongDetailRepository } from '../repositories/song-detail.repository';
import { formatByYear } from '../utils/media-format';
import { CatalogService } from './catalog.service';
import { HomeService } from './home.service';
import { InstrumentsService } from './instruments.service';
import { LibraryService } from './library.service';

/** Tipo de item escolhido nos filtros da busca ('all' = tudo). */
export type ExploreScope = 'all' | SearchScope;

/** Cartão de coleção: uma coleção do banco, década de gravações ou tipo de instrumento. */
export interface Collection {
  id: string;
  kind: 'collection' | 'decade' | 'instrument';
  title: string;
  count: number;
  unit: string;
  collectionId?: number;
  description?: string;
  decade?: number;
  type?: string;
}

/** Cartão do "Acervo físico": um formato de mídia ou um tipo de item do acervo. */
export interface PhysicalCollection {
  id: string;
  kind: MediaFormat | 'scores' | 'instruments' | 'artists';
  title: string;
  count: number;
  unit: string;
}

const FEATURED = 6;

/** 1990 -> "Anos 90"; 2010 -> "Anos 2010". */
export const decadeLabel = (decade: number) => (decade >= 1910 && decade < 2000 ? `Anos ${decade - 1900}` : `Anos ${decade}`);

const decadeOf = (year?: number | null) => (year ? Math.floor(year / 10) * 10 : null);

/**
 * Estado da tela Descobrir: números do acervo para as coleções (décadas, instrumentos, formatos) e o
 * tipo de item escolhido na busca. Os resultados ficam para a tela futura (/descobrir/resultados).
 */
@Injectable({ providedIn: 'root' })
export class ExploreService {
  private readonly catalog = inject(CatalogService);
  private readonly catalogRepo = inject(CatalogRepository);
  private readonly library = inject(LibraryService);
  private readonly home = inject(HomeService);
  private readonly instruments = inject(InstrumentsService);
  private readonly songDetails = inject(SongDetailRepository);

  readonly scope = signal<ExploreScope>('all');
  readonly collections = signal<ColecaoDto[]>([]);
  private readonly scoresTotal = signal(0);
  private loading?: Promise<void>;

  // ---------- números do acervo ----------
  readonly songsTotal = computed(() => this.catalog.tracks().length);
  readonly artistsTotal = computed(() => this.home.artistsAll().length);
  readonly instrumentsTotal = computed(() => this.instruments.instruments().length);

  /** Décadas com gravações, da mais antiga para a mais nova. */
  readonly decades = computed(() => {
    const counts = new Map<number, number>();
    for (const t of this.catalog.tracks()) {
      const d = decadeOf(t.year);
      if (d !== null) counts.set(d, (counts.get(d) ?? 0) + 1);
    }
    return [...counts.entries()].map(([decade, count]) => ({ decade, count })).sort((a, b) => a.decade - b.decade);
  });

  /** Tipos de instrumento (instrumento.tipo_instrumento), os mais comuns primeiro. */
  readonly instrumentTypes = computed(() =>
    [...this.instruments.types()].sort((a, b) => b.count - a.count || a.type.localeCompare(b.type, 'pt-BR')),
  );

  readonly formatCounts = computed(() => {
    const counts: Record<MediaFormat, number> = { vinyl: 0, cassette: 0, cd: 0 };
    for (const t of this.catalog.tracks()) counts[formatByYear(t.year)]++;
    return counts;
  });

  /** Coleções em destaque: coleções do banco de dados (tabela colecao). */
  readonly featured = computed<Collection[]>(() => {
    const dbCols = this.collections();
    if (dbCols.length > 0) {
      return dbCols.map((c): Collection => ({
        id: `col-${c.id_colecao}`,
        kind: 'collection',
        title: c.titulo,
        count: c.total_musicas ?? c.total_itens ?? 0,
        unit: (c.total_musicas ?? c.total_itens ?? 0) === 1 ? 'música' : 'músicas',
        collectionId: c.id_colecao,
        description: c.descricao ?? undefined,
      }));
    }
    const byCount = [...this.decades()].sort((a, b) => b.count - a.count || b.decade - a.decade);
    const types = this.instrumentTypes().slice(0, 3);
    const decadeSlots = Math.max(3, FEATURED - types.length);
    return [
      ...byCount
        .slice(0, decadeSlots)
        .sort((a, b) => b.decade - a.decade)
        .map((d): Collection => ({ id: `d${d.decade}`, kind: 'decade', title: decadeLabel(d.decade), count: d.count, unit: d.count === 1 ? 'gravação' : 'gravações', decade: d.decade })),
      ...types.map((t): Collection => ({ id: `i${t.type}`, kind: 'instrument', title: t.type, count: t.count, unit: t.count === 1 ? 'instrumento' : 'instrumentos', type: t.type })),
    ].slice(0, FEATURED);
  });

  readonly physical = computed<PhysicalCollection[]>(() => {
    const f = this.formatCounts();
    const items: PhysicalCollection[] = [
      { id: 'vinyl', kind: 'vinyl', title: 'Discos de Vinil', count: f.vinyl, unit: 'gravações' },
      { id: 'cassette', kind: 'cassette', title: 'Fitas K7', count: f.cassette, unit: 'gravações' },
      { id: 'cd', kind: 'cd', title: 'CDs', count: f.cd, unit: 'gravações' },
      { id: 'scores', kind: 'scores', title: 'Partituras Originais', count: this.scoresTotal(), unit: 'partituras' },
      { id: 'instruments', kind: 'instruments', title: 'Instrumentos Históricos', count: this.instrumentsTotal(), unit: 'instrumentos' },
      { id: 'artists', kind: 'artists', title: 'Compositores & Mestres', count: this.artistsTotal(), unit: 'artistas' },
    ];
    return items.filter((i) => i.count > 0);
  });

  /** Chips "Tipo de item" da busca, com as contagens. */
  readonly scopeChips = computed(() => [
    { id: 'all', label: 'Todos' },
    { id: 'musicas', label: 'Músicas', count: this.songsTotal() },
    { id: 'artistas', label: 'Artistas', count: this.artistsTotal() },
    { id: 'instrumentos', label: 'Instrumentos', count: this.instrumentsTotal() },
    { id: 'partituras', label: 'Partituras', count: this.scoresTotal() },
  ]);

  load(): Promise<void> {
    return (this.loading ??= this.fetch());
  }

  setScope(id: string): void {
    this.scope.set(id as ExploreScope);
  }

  // ---------- critérios enviados à tela de resultados ----------
  /** Busca digitada (+ tipo escolhido). Sem texto e sem tipo, não há o que buscar (null). */
  forSearch(): ExploreQuery | null {
    const q = this.library.query().trim();
    const scope = this.scope();
    if (!q && scope === 'all') return null;
    return { q: q || undefined, tipo: scope === 'all' ? undefined : scope };
  }

  forCollection(collection: Collection): ExploreQuery {
    if (collection.kind === 'collection') {
      return { tipo: 'musicas', colecao: collection.collectionId, colecao_titulo: collection.title };
    }
    return collection.kind === 'decade'
      ? { decada: collection.decade }
      : { tipo: 'instrumentos', instrumento: collection.type };
  }

  forPhysical(item: PhysicalCollection): ExploreQuery {
    switch (item.kind) {
      case 'vinyl':
      case 'cassette':
      case 'cd':
        return { tipo: 'musicas', formato: item.kind };
      case 'scores':
        return { tipo: 'partituras' };
      case 'instruments':
        return { tipo: 'instrumentos' };
      case 'artists':
        return { tipo: 'artistas' };
    }
  }

  forDecade(decade: number): ExploreQuery {
    return { decada: decade };
  }

  async getCollectionTracks(collectionId: number): Promise<Track[]> {
    await this.catalog.load();
    const songs = await this.catalogRepo.listCollectionSongs(collectionId);
    return songs.map((s) => {
      const existing = this.catalog.byId(s.id_musica);
      if (existing) return existing;
      return toTrack(s, new Map(), new Map(), []);
    });
  }

  private async fetch(): Promise<void> {
    await Promise.all([
      this.library.load(),
      this.instruments.load(),
      this.catalogRepo.listCollections().then((cols) => this.collections.set(cols), () => undefined),
      // partituras só entram na contagem: se a rota falhar, o cartão simplesmente não aparece
      this.songDetails.listAllScores().then((rows) => this.scoresTotal.set(rows.length), () => undefined),
    ]);
  }
}
