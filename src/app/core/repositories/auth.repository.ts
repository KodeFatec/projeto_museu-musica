import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api-client.service';
import { ENDPOINTS } from '../api/endpoints';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/dto';

/** Login e cadastro. Rotas PLANEJADAS: POST /api/auth/login e POST /api/auth/register (devolvem { token }). */
@Injectable({ providedIn: 'root' })
export class AuthRepository {
  constructor(private readonly api: ApiClient) {}

  login(body: LoginRequest): Promise<AuthResponse> {
    return this.api.post<AuthResponse>(ENDPOINTS.authLogin, body);
  }

  register(body: RegisterRequest): Promise<AuthResponse> {
    return this.api.post<AuthResponse>(ENDPOINTS.authRegister, body);
  }
}
