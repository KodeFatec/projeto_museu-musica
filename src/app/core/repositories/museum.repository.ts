import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api-client.service';
import { ENDPOINTS } from '../api/endpoints';
import { AtividadeDto, MuseuDto, SalaDto } from '../models/dto';

/** Eventos (atividade), dados do museu e salas. Todas as rotas são PLANEJADAS no backend. */
@Injectable({ providedIn: 'root' })
export class MuseumRepository {
  constructor(private readonly api: ApiClient) {}

  listActivities(): Promise<AtividadeDto[]> {
    return this.api.list<AtividadeDto>(ENDPOINTS.atividades);
  }

  /**
   * Eventos ligados ao artista (PLANEJADA): GET /artistas/:id/atividades.
   * No banco o caminho é atividade_item -> item_acervo -> partitura -> musica -> musica_artista.
   */
  listArtistActivities(artistId: number): Promise<AtividadeDto[]> {
    return this.api.list<AtividadeDto>(`${ENDPOINTS.artistas}/${artistId}/atividades`);
  }

  getMuseum(): Promise<MuseuDto> {
    return this.api.get<MuseuDto>(ENDPOINTS.museu);
  }

  listRooms(): Promise<SalaDto[]> {
    return this.api.list<SalaDto>(ENDPOINTS.salas);
  }
}
