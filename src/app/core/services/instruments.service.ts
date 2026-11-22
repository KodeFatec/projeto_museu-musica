import { computed, Injectable, signal } from '@angular/core';
import { toApiError } from '../api/api-error';
import { toInstrument } from '../mappers/instrument.mapper';
import { Instrument } from '../models/instrument.model';
import { CatalogRepository } from '../repositories/catalog.repository';
import { LoadStatus } from './catalog.service';
import { LibraryService } from './library.service';

export type InstrumentSort = 'name' | 'oldest' | 'newest' | 'maker';

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Injectable({ providedIn: 'root' })
export class InstrumentsService {
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly instruments = signal<Instrument[]>([]);
  readonly type = signal<string | null>(null);
  readonly sort = signal<InstrumentSort>('name');
  private loading?: Promise<void>;

  readonly types = computed(() => {
    const counts = new Map<string, number>();
    this.instruments().forEach((instrument) => {
      if (instrument.type) counts.set(instrument.type, (counts.get(instrument.type) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
      .map(([type, count]) => ({ type, count }));
  });

  readonly oldestYear = computed(() => {
    const years = this.instruments().map((instrument) => instrument.year).filter((year): year is number => year !== undefined);
    return years.length ? Math.min(...years) : null;
  });

  readonly filtered = computed(() => {
    const selectedType = this.type();
    const query = normalize(this.library.query().trim());
    const visible = this.instruments().filter((instrument) => {
      const text = normalize(
        [instrument.title, instrument.type, instrument.maker, instrument.description, instrument.origin, instrument.year]
          .filter(Boolean)
          .join(' '),
      );
      return (!selectedType || instrument.type === selectedType) && (!query || text.includes(query));
    });
    return [...visible].sort(this.comparator(this.sort()));
  });

  constructor(private readonly repository: CatalogRepository, private readonly library: LibraryService) {}

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
      this.instruments.set((await this.repository.listInstruments()).map(toInstrument));
      this.status.set('ready');
    } catch (error) {
      this.loading = undefined;
      this.error.set(toApiError(error).message);
      this.status.set('error');
    }
  }

  private comparator(sort: InstrumentSort): (a: Instrument, b: Instrument) => number {
    const byName = (a: Instrument, b: Instrument) => a.title.localeCompare(b.title, 'pt-BR');
    switch (sort) {
      case 'oldest':
        return (a, b) => (a.year ?? Infinity) - (b.year ?? Infinity) || byName(a, b);
      case 'newest':
        return (a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity) || byName(a, b);
      case 'maker':
        return (a, b) => (a.maker ?? '\uffff').localeCompare(b.maker ?? '\uffff', 'pt-BR') || byName(a, b);
      default:
        return byName;
    }
  }
}
