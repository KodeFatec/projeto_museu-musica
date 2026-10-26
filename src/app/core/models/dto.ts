/**
 * DTOs = formato EXATO que a API devolve (nomes das colunas do banco, em snake_case).
 * Cada interface indica a tabela do MER e se a rota já existe no backend.
 * Os components nunca usam estes tipos: os mappers convertem para os modelos de domínio.
 */

/** Resposta padrão de listagens do backend: { total, dados }. */
export interface ListResponse<T> {
  total: number;
  dados: T[];
}

/** Tabela `musica` — GET /api/musicas (existe). */
export interface MusicaDto {
  id_musica: number;
  id_genero: number | null;
  titulo: string;
  isrc: string | null;
  /** "HH:MM:SS" */
  duracao: string;
  ano_gravacao: number | null;
  descricao: string | null;
  arquivo_audio: string | null;
  spotify_uri: string | null;
  youtube_video_id: string | null;
}

/** Tabela `genero_musical` — GET /api/generos (PLANEJADA: ainda não existe no backend). */
export interface GeneroMusicalDto {
  id_genero: number;
  nome: string;
  descricao: string | null;
}

/** Tabela `artista` — GET /api/artistas (existe). */
export interface ArtistaDto {
  id_artista: number;
  nome_artistico: string | null;
  nome_completo: string | null;
  biografia: string | null;
  data_nascimento: string | null;
  data_falecimento: string | null;
  foto_url: string | null;
}

/** Tabela `musica_artista` — GET /api/musica-artista (PLANEJADA). */
export interface MusicaArtistaDto {
  id_musica: number;
  id_artista: number;
  tipo_participacao: string | null;
}

/** Tabela `letra_trecho` — GET /api/letra_trecho (existe). Tempos em "HH:MM:SS". */
export interface LetraTrechoDto {
  id_trecho: number;
  id_musica: number;
  tempo_inicio: string;
  tempo_fim: string;
  ordem: number;
  texto: string;
}

/** `partitura` + `item_acervo` (JOIN) — GET /api/partituras (existe). */
export interface PartituraDto {
  id_item: number;
  id_musica: number | null;
  id_categoria: number;
  titulo: string;
  descricao: string | null;
  origem: string | null;
  data_aquisicao: string | null;
  estado_conservacao: string | null;
  autor: string | null;
  ano_criacao: number | null;
  arquivo_url: string | null;
  id_usuario_cadastro: number | null;
}

/** Tabela `musica_favorita` — GET/POST /api/musicas-favoritas (existe; DELETE é PLANEJADO). */
export interface MusicaFavoritaDto {
  id_usuario: number;
  id_musica: number;
  data_favoritada: string;
}

/** Tabela `historico_musica` — /api/historico_musica (existe). */
export interface HistoricoMusicaDto {
  id_historico: number;
  id_usuario: number;
  id_musica: number;
  data_reproducao: string;
  /** "HH:MM:SS" */
  progresso: string | null;
}

/** Tabela `usuario` — GET /api/usuarios/:id (PLANEJADA). Nunca inclui senha_hash. */
export interface UsuarioDto {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string | null;
  data_cadastro: string;
}

/** `perfil_usuario` via `usuario_perfil` — GET /api/usuarios/:id/perfis (PLANEJADA). */
export interface PerfilUsuarioDto {
  id_perfil: number;
  nome: string;
}
