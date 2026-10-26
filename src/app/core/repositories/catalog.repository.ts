import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api-client.service';
import { ENDPOINTS } from '../api/endpoints';
import { ArtistaDto, GeneroMusicalDto, MusicaArtistaDto, MusicaDto } from '../models/dto';

/** Músicas, gêneros, artistas e a ligação entre eles. */
@Injectable({ providedIn: 'root' })
export class CatalogRepository {
  constructor(private readonly api: ApiClient) {}

  listSongs(): Promise<MusicaDto[]> {
    return this.api.list<MusicaDto>(ENDPOINTS.musicas);
  }
  listGenres(): Promise<GeneroMusicalDto[]> {
    return this.api.list<GeneroMusicalDto>(ENDPOINTS.generos);
  }
  listArtists(): Promise<ArtistaDto[]> {
    return this.api.list<ArtistaDto>(ENDPOINTS.artistas);
  }
  listSongArtists(): Promise<MusicaArtistaDto[]> {
    return this.api.list<MusicaArtistaDto>(ENDPOINTS.musicaArtista);
  }
}
