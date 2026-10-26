/**
 * Rotas da API (prefixo /api vem do baseURL do Axios).
 * As marcadas como PLANEJADA ainda não existem no repositório do backend.
 */
export const ENDPOINTS = {
  musicas: '/musicas',
  artistas: '/artistas',
  partituras: '/partituras',
  letras: '/letra_trecho',
  favoritas: '/musicas-favoritas',
  historico: '/historico_musica',
  generos: '/generos', // PLANEJADA
  musicaArtista: '/musica-artista', // PLANEJADA
  usuarios: '/usuarios', // PLANEJADA
} as const;
