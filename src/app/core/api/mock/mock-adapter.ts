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
/** JWT de mentira (sem assinatura de verdade) com sub = id do usuário, válido por 1 hora. */
const mockToken = (userId: string | number): string => {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const now = Math.floor(Date.now() / 1000);
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ sub: String(userId), iat: now, exp: now + 3600 })}.mock`;
};

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
    atividades: { rows: () => db.atividades as unknown as Row[], idKey: 'id_atividade' },
    salas: { rows: () => db.salas as unknown as Row[], idKey: 'id_sala' },
    instrumentos: { rows: () => db.instrumentos as unknown as Row[], idKey: 'id_item' },
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

  // --- login e cadastro (rotas planejadas): devolvem um JWT { token }
  if (resource === 'auth' && method === 'post') {
    if (first === 'login') {
      const login = String(body['login'] ?? '').trim().toLowerCase();
      const digits = login.replace(/\D/g, '');
      const user =
        db.usuarios.find((u) => u.email.toLowerCase() === login) ??
        db.usuarios.find((u) => db.credenciais.some((c) => c.id_usuario === u.id_usuario && digits !== '' && c.cpf === digits));
      const credential = db.credenciais.find((c) => c.id_usuario === user?.id_usuario);
      if (!user || !credential || credential.senha !== String(body['senha'] ?? '')) return fail(config, 401, 'Credenciais inválidas');
      return respond(config, { token: mockToken(user.id_usuario) });
    }
    if (first === 'register') {
      const cpf = String(body['cpf'] ?? '').replace(/\D/g, '');
      const email = String(body['email'] ?? '').trim().toLowerCase();
      const name = String(body['nome'] ?? '').trim();
      const password = String(body['senha'] ?? '');
      const details = [
        name.length < 3 ? { campo: 'nome', mensagem: 'Informe o nome completo' } : null,
        cpf.length !== 11 ? { campo: 'cpf', mensagem: 'CPF inválido' } : null,
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? { campo: 'email', mensagem: 'E-mail inválido' } : null,
        password.length < 8 ? { campo: 'senha', mensagem: 'A senha precisa de pelo menos 8 caracteres' } : null,
      ].filter(Boolean);
      if (details.length) {
        throw new AxiosError('Dados inválidos', 'ERR_BAD_REQUEST', config, null, respond(config, { erro: 'Dados inválidos', detalhes: details }, 400));
      }
      if (db.usuarios.some((u) => u.email.toLowerCase() === email) || db.credenciais.some((c) => c.cpf === cpf)) {
        return fail(config, 409, 'E-mail ou CPF já cadastrado');
      }
      const id = (Math.max(0, ...db.usuarios.map((u) => Number(u.id_usuario) || 0)) || 0) + 1;
      db.usuarios.push({ id_usuario: id, nome: name, email, telefone: (body['telefone'] as string) ?? null, data_cadastro: new Date().toISOString().slice(0, 19).replace('T', ' ') });
      db.credenciais.push({ id_usuario: id, cpf, senha: password });
      db.perfisDoUsuario[id] = [{ id_perfil: 2, nome: 'Ouvinte' }];
      return respond(config, { token: mockToken(id) }, 201);
    }
  }

  // --- usuários (rota planejada)
  if (resource === 'usuarios' && method === 'get') {
    const user = db.usuarios.find((u) => String(u.id_usuario) === first);
    if (!user) return fail(config, 404, 'Usuário não encontrado');
    return second === 'perfis'
      ? respond(config, envelope((db.perfisDoUsuario[Number(user.id_usuario)] ?? []) as unknown as Row[]))
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

  // --- eventos do artista (rota planejada): atividade_item -> partitura -> musica -> musica_artista
  if (resource === 'artistas' && second === 'atividades' && method === 'get') {
    const songIds = db.musicaArtista.filter((l) => String(l.id_artista) === first).map((l) => l.id_musica);
    const itemIds = db.partituras.filter((p) => p.id_musica !== null && songIds.includes(p.id_musica)).map((p) => p.id_item);
    const activityIds = new Set(db.atividadeItens.filter((ai) => itemIds.includes(ai.id_item)).map((ai) => ai.id_atividade));
    return respond(config, envelope(db.atividades.filter((a) => activityIds.has(a.id_atividade)) as unknown as Row[]));
  }

  // --- detalhe do instrumento (rota planejada): item + mídias + localização + eventos
  if (resource === 'instrumentos' && first !== undefined && method === 'get') {
    const item = db.instrumentos.find((i) => String(i.id_item) === first);
    if (!item) return fail(config, 404, 'Instrumento não encontrado');
    const localizacoes = db.itemLocalizacoes
      .filter((l) => l.id_item === item.id_item)
      .map((l) => {
        const room = db.salas.find((s) => s.id_sala === l.id_sala);
        return { ...l, sala: room ? { nome: room.nome, descricao: room.descricao } : undefined };
      });
    const activityIds = new Set(db.atividadeItens.filter((ai) => ai.id_item === item.id_item).map((ai) => ai.id_atividade));
    return respond(config, { ...item, localizacoes, atividades: db.atividades.filter((a) => activityIds.has(a.id_atividade)) });
  }

  // --- museu (rota planejada): um único registro
  if (resource === 'museu' && method === 'get') return respond(config, db.museu);

  // --- leitura genérica
  const table = tables[resource];
  if (table && method === 'get') {
    if (first === undefined) return respond(config, envelope(table.rows()));
    const row = table.rows().find((r) => String(r[table.idKey]) === first);
    return row ? respond(config, row) : fail(config, 404, 'Registro não encontrado');
  }

  return fail(config, 404, 'Rota não encontrada');
};
