import { ParamMap, Params } from '@angular/router';
import { MediaFormat } from './media.model';

/** O que se busca. Cada valor é um grupo do acervo. */
export type SearchScope = 'musicas' | 'artistas' | 'instrumentos' | 'partituras';

/**
 * Critérios que a tela Descobrir manda para a futura tela de resultados (/descobrir/resultados),
 * como parâmetros da URL (ex.: /descobrir/resultados?decada=1970 ou ?q=piano&tipo=instrumentos).
 */
export interface ExploreQuery {
  /** Texto digitado (título, artista, ISRC, gênero, instrumento...). */
  q?: string;
  tipo?: SearchScope;
  /** Primeiro ano da década: 1970 = anos 70. */
  decada?: number;
  formato?: MediaFormat;
  /** instrumento.tipo_instrumento. */
  instrumento?: string;
  /** colecao.id_colecao. */
  colecao?: number;
  colecao_titulo?: string;
}

/** O formato vai na URL em português: vinil, k7 ou cd. */
const FORMAT_TO_URL: Record<MediaFormat, string> = { vinyl: 'vinil', cassette: 'k7', cd: 'cd' };
const URL_TO_FORMAT: Record<string, MediaFormat> = { vinil: 'vinyl', k7: 'cassette', cd: 'cd' };
const SCOPES: SearchScope[] = ['musicas', 'artistas', 'instrumentos', 'partituras'];

/** ExploreQuery -> queryParams do Router (só os campos preenchidos). */
export function toQueryParams(query: ExploreQuery): Params {
  const params: Params = {};
  if (query.q?.trim()) params['q'] = query.q.trim();
  if (query.tipo) params['tipo'] = query.tipo;
  if (query.decada) params['decada'] = query.decada;
  if (query.formato) params['formato'] = FORMAT_TO_URL[query.formato];
  if (query.instrumento) params['instrumento'] = query.instrumento;
  if (query.colecao) params['colecao'] = query.colecao;
  if (query.colecao_titulo) params['colecao_titulo'] = query.colecao_titulo;
  return params;
}

/** Lado de lá: queryParams da URL -> ExploreQuery (ignora valores inválidos). */
export function fromQueryParams(params: ParamMap): ExploreQuery {
  const decade = Number(params.get('decada'));
  const colecao = Number(params.get('colecao'));
  const scope = params.get('tipo') as SearchScope | null;
  const format = URL_TO_FORMAT[params.get('formato') ?? ''];
  return {
    q: params.get('q')?.trim() || undefined,
    tipo: scope && SCOPES.includes(scope) ? scope : undefined,
    decada: Number.isInteger(decade) && decade > 0 ? decade : undefined,
    formato: format,
    instrumento: params.get('instrumento') || undefined,
    colecao: Number.isInteger(colecao) && colecao > 0 ? colecao : undefined,
    colecao_titulo: params.get('colecao_titulo') || undefined,
  };
}
