import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api-client.service';
import { ENDPOINTS } from '../api/endpoints';
import { HistoricoMusicaDto, ListResponse, MusicaFavoritaDto } from '../models/dto';

@Injectable({ providedIn: 'root' })
export class FavoritesRepository {
  constructor(private readonly api: ApiClient) {}

  /** Hoje GET /musicas-favoritas/:id_usuario devolve só uma linha; por isso lista tudo e filtra aqui. */
  async listByUser(userId: number): Promise<MusicaFavoritaDto[]> {
    const rows = await this.api.list<MusicaFavoritaDto>(ENDPOINTS.favoritas, {
      id_usuario: userId,
    });
    return rows.filter((r) => r.id_usuario === userId);
  }

  add(userId: number, songId: number): Promise<unknown> {
    return this.api.post(ENDPOINTS.favoritas, { id_usuario: userId, id_musica: songId });
  }

  /** Rota PLANEJADA no backend: DELETE /api/musicas-favoritas/:id_usuario/:id_musica. */
  remove(userId: number, songId: number): Promise<void> {
    return this.api.delete(`${ENDPOINTS.favoritas}/${userId}/${songId}`);
  }
}

@Injectable({ providedIn: 'root' })
export class HistoryRepository {
  constructor(private readonly api: ApiClient) {}

  async listByUser(userId: number): Promise<HistoricoMusicaDto[]> {
    const rows = await this.api.list<HistoricoMusicaDto>(ENDPOINTS.historico, {
      id_usuario: userId,
    });
    return rows.filter((r) => r.id_usuario === userId);
  }

  async create(userId: number, songId: number, progress: string): Promise<HistoricoMusicaDto> {
    const body = await this.api.post<{ dados?: HistoricoMusicaDto } & Partial<HistoricoMusicaDto>>(
      ENDPOINTS.historico,
      {
        id_usuario: userId,
        id_musica: songId,
        progresso: progress,
      },
    );
    return (body.dados ?? body) as HistoricoMusicaDto;
  }

  /** O PUT do backend exige id_usuario, id_musica e progresso. */
  updateProgress(id: number, userId: number, songId: number, progress: string): Promise<unknown> {
    return this.api.put(`${ENDPOINTS.historico}/${id}`, {
      id_usuario: userId,
      id_musica: songId,
      progresso: progress,
    });
  }
}
