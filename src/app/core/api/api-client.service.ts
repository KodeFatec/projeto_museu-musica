import { Injectable } from '@angular/core';
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { environment } from '../../../environments/environment';
import { ListResponse } from '../models/dto';
import { toApiError } from './api-error';
import { mockAdapter } from './mock/mock-adapter';

/** Único ponto que conhece o Axios. Repositories usam apenas estes métodos. */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http: AxiosInstance;

  constructor() {
    const config: CreateAxiosDefaults = {
      baseURL: environment.apiBaseUrl,
      timeout: 10_000,
      headers: { 'Content-Type': 'application/json' },
    };
    // Com useMocks, o Axios continua sendo usado, mas a resposta vem do mock-db (mesmo formato da API).
    if (environment.useMocks) config.adapter = mockAdapter;

    this.http = axios.create(config);
    // Futuro login: this.http.interceptors.request.use((req) => { req.headers.Authorization = `Bearer ${token}`; return req; });
    this.http.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(toApiError(error)),
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return (await this.http.get<T>(url, { params })).data;
  }

  /** GET de listagem: devolve só `dados` do envelope { total, dados }. */
  async list<T>(url: string, params?: Record<string, unknown>): Promise<T[]> {
    return (await this.get<ListResponse<T>>(url, params)).dados;
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    return (await this.http.post<T>(url, body)).data;
  }

  async put<T>(url: string, body: unknown): Promise<T> {
    return (await this.http.put<T>(url, body)).data;
  }

  async delete(url: string): Promise<void> {
    await this.http.delete(url);
  }
}
