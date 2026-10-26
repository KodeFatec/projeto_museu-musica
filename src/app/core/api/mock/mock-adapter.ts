import { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as db from './mock-db';

type Row = Record<string, unknown>;

/**
 * Adapter do Axios que imita o backend (mesmas rotas, envelope { total, dados } e status).
 * Só é usado quando environment.useMocks = true. Os filtros por query (?id_musica=, ?id_usuario=)
 * simulam o que o backend vai precisar aceitar.
 */
const respond = (
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
): AxiosResponse => ({
  data,
  status,
  statusText: status < 400 ? 'OK' : 'Error',
  headers: {},
  config,
});

const fail = (config: InternalAxiosRequestConfig, status: number, erro: string): never => {
  throw new AxiosError(erro, 'ERR_BAD_REQUEST', config, null, respond(config, { erro }, status));
};

const envelope = (rows: Row[]) => ({ total: rows.length, dados: rows });
/** Filtro por query string (?id_musica=4): os valores chegam como número ou texto, então compara como texto. */
const filterBy = (rows: Row[], key: string, value?: unknown) =>
  value === undefined || value === null
    ? rows
    : rows.filter((r) => String(r[key]) === String(value));
const nowSql = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const parseBody = (data: unknown): Row =>
  typeof data === 'string' && data ? JSON.parse(data) : ((data as Row) ?? {});

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const method = (config.method ?? 'get').toLowerCase();
  const [resource, first, second] = (config.url ?? '').replace(/^\/+|\/+$/g, '').split('/');
  const query = (config.params ?? {}) as Record<string, unknown>;
  const body = parseBody(config.data);

  const tables: Record<string, { rows: () => Row[]; idKey: string }> = {
    musicas: { rows: () => db.musicas as unknown as Row[], idKey: 'id_musica' },
    artistas: { rows: () => db.artistas as unknown as Row[], idKey: 'id_artista' },
    generos: { rows: () => db.generos as unknown as Row[], idKey: 'id_genero' },
    'musica-artista': {
      rows: () => filterBy(db.musicaArtista as unknown as Row[], 'id_musica', query['id_musica']),
      idKey: 'id_musica',
    },
    letra_trecho: {
      rows: () => filterBy(db.letraTrechos as unknown as Row[], 'id_musica', query['id_musica']),
      idKey: 'id_trecho',
    },
    partituras: {
      rows: () => filterBy(db.partituras as unknown as Row[], 'id_musica', query['id_musica']),
      idKey: 'id_item',
    },
    'musicas-favoritas': {
      rows: () => filterBy(db.favoritas as unknown as Row[], 'id_usuario', query['id_usuario']),
      idKey: 'id_usuario',
    },
    historico_musica: {
      rows: () => filterBy(db.historico as unknown as Row[], 'id_usuario', query['id_usuario']),
      idKey: 'id_historico',
    },
  };

  // --- usuários (rota planejada)
  if (resource === 'usuarios' && method === 'get') {
    const user = db.usuarios.find((u) => String(u.id_usuario) === first);
    if (!user) return fail(config, 404, 'Usuário não encontrado');
    return second === 'perfis'
      ? respond(config, envelope((db.perfisDoUsuario[user.id_usuario] ?? []) as unknown as Row[]))
      : respond(config, user);
  }

  // --- favoritas: POST adiciona, DELETE /:id_usuario/:id_musica remove (rota planejada)
  if (resource === 'musicas-favoritas' && method === 'post') {
    const row = {
      id_usuario: Number(body['id_usuario']),
      id_musica: Number(body['id_musica']),
      data_favoritada: nowSql(),
    };
    if (!db.favoritas.some((f) => f.id_usuario === row.id_usuario && f.id_musica === row.id_musica))
      db.favoritas.push(row);
    return respond(config, row, 201);
  }
  if (resource === 'musicas-favoritas' && method === 'delete') {
    const index = db.favoritas.findIndex(
      (f) => String(f.id_usuario) === first && String(f.id_musica) === second,
    );
    if (index < 0) return fail(config, 404, 'Música favorita não encontrada para este usuário');
    db.favoritas.splice(index, 1);
    return respond(config, null, 204);
  }

  // --- histórico: POST cria, PUT /:id atualiza o progresso
  if (resource === 'historico_musica' && method === 'post') {
    const row = {
      id_historico: db.historico.length + 1,
      id_usuario: Number(body['id_usuario']),
      id_musica: Number(body['id_musica']),
      data_reproducao: nowSql(),
      progresso: (body['progresso'] as string) ?? null,
    };
    db.historico.push(row);
    return respond(
      config,
      { mensagem: 'Registro de histórico criado com sucesso', dados: row },
      201,
    );
  }
  if (resource === 'historico_musica' && method === 'put') {
    const row = db.historico.find((h) => String(h.id_historico) === first);
    if (!row) return fail(config, 404, 'Registro de histórico não encontrado');
    row.progresso = (body['progresso'] as string) ?? null;
    return respond(config, {
      mensagem: 'Registro de histórico atualizado com sucesso',
      dados: row,
    });
  }

  // --- leitura genérica
  const table = tables[resource];
  if (table && method === 'get') {
    if (first === undefined) return respond(config, envelope(table.rows()));
    const row = table.rows().find((r) => String(r[table.idKey]) === first);
    return row ? respond(config, row) : fail(config, 404, 'Registro não encontrado');
  }

  return fail(config, 404, 'Rota não encontrada');
};
