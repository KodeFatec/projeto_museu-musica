import { AxiosError } from 'axios';

/** Erro padronizado: a API responde { erro, detalhes? } (ver middleware validarResultado). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly details: { campo: string; mensagem: string }[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof AxiosError) {
    const body = error.response?.data as
      | { erro?: string; detalhes?: { campo: string; mensagem: string }[] }
      | undefined;
    if (error.response)
      return new ApiError(
        body?.erro ?? 'Erro ao falar com o servidor',
        error.response.status,
        body?.detalhes,
      );
    return new ApiError('Não foi possível conectar ao servidor', null);
  }
  return new ApiError(error instanceof Error ? error.message : 'Erro inesperado', null);
}
