import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api-client.service';
import { ENDPOINTS } from '../api/endpoints';
import { PerfilUsuarioDto, UsuarioDto } from '../models/dto';


@Injectable({ providedIn: 'root' })
export class UsersRepository {
  constructor(private readonly api: ApiClient) {}

  getById(id: number): Promise<UsuarioDto> {
    return this.api.get<UsuarioDto>(`${ENDPOINTS.usuarios}/${id}`);
  }

  listProfiles(id: number): Promise<PerfilUsuarioDto[]> {
    return this.api.list<PerfilUsuarioDto>(`${ENDPOINTS.usuarios}/${id}/perfis`);
  }
}
