import { Injectable, signal } from '@angular/core';
import { toApiError } from '../api/api-error';
import { toInstrumentDetail } from '../mappers/instrument.mapper';
import { Instrument, InstrumentDetail, InstrumentMedia } from '../models/instrument.model';
import { CatalogRepository } from '../repositories/catalog.repository';
import { LoadStatus } from './catalog.service';
import { InstrumentsService } from './instruments.service';

/**
 * Estado da tela de detalhe do instrumento. Busca GET /instrumentos/:id; se essa rota falhar mas o
 * instrumento existir na listagem, mostra o que a listagem já sabe (sem localização nem eventos).
 */
@Injectable({ providedIn: 'root' })
export class InstrumentDetailService {
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly detail = signal<InstrumentDetail | null>(null);
  private currentId: number | null = null;

  constructor(
    private readonly repository: CatalogRepository,
    private readonly instruments: InstrumentsService,
  ) {}

  async load(id: number): Promise<void> {
    if (this.currentId === id && this.status() === 'ready') return;
    this.currentId = id;
    this.status.set('loading');
    this.error.set(null);
    this.detail.set(null);

    try {
      const dto = await this.repository.getInstrument(id);
      if (this.currentId === id) this.finish(toInstrumentDetail(dto));
    } catch (e) {
      if (this.currentId !== id) return;
      // a rota de detalhe pode não existir ainda: tenta com os dados da listagem
      await this.instruments.load();
      const base = this.instruments.instruments().find((i) => i.id === id);
      if (this.currentId !== id) return;
      if (base) this.finish(this.fromList(base));
      else {
        this.error.set(toApiError(e).message);
        this.status.set('error');
      }
    }
  }

  private finish(detail: InstrumentDetail): void {
    this.detail.set(detail);
    this.status.set('ready');
  }

  private fromList(base: Instrument): InstrumentDetail {
    const media: InstrumentMedia[] = [];
    if (base.photoUrl) media.push({ id: -1, kind: 'image', url: base.photoUrl });
    if (base.audioUrl) media.push({ id: -2, kind: 'audio', url: base.audioUrl });
    return { ...base, media, locations: [], events: [] };
  }
}
