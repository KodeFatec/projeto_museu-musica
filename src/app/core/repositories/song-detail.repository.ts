import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api-client.service';
import { ENDPOINTS } from '../api/endpoints';
import { LetraTrechoDto, PartituraDto } from '../models/dto';

/** Letra e partitura de uma música. */
@Injectable({ providedIn: 'root' })
export class SongDetailRepository {
  constructor(private readonly api: ApiClient) {}

  /** Backend ainda lista tudo: o filtro ?id_musica precisa ser aceito lá; o filtro local garante o resultado. */
  async listLyrics(songId: number): Promise<LetraTrechoDto[]> {
    const rows = await this.api.list<LetraTrechoDto>(ENDPOINTS.letras, { id_musica: songId });
    return rows.filter((r) => r.id_musica === songId);
  }

  async listScores(songId: number): Promise<PartituraDto[]> {
    const rows = await this.api.list<PartituraDto>(ENDPOINTS.partituras, { id_musica: songId });
    return rows.filter((r) => r.id_musica === songId);
  }
}
