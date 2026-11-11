import {
  ArtistaDto,
  AtividadeDto,
  GeneroMusicalDto,
  HistoricoMusicaDto,
  LetraTrechoDto,
  MusicaArtistaDto,
  MusicaDto,
  MusicaFavoritaDto,
  MuseuDto,
  PartituraDto,
  PerfilUsuarioDto,
  SalaDto,
  UsuarioDto,
} from '../../models/dto';

/**
 * Dados de EXEMPLO no mesmo formato das tabelas do banco (só para desenvolver sem o backend).
 * Os ISRCs, durações e textos são fictícios.
 */

const musica = (
  id_musica: number,
  titulo: string,
  id_genero: number,
  ano_gravacao: number,
  duracao: string,
  descricao: string | null = null,
): MusicaDto => ({
  id_musica,
  id_genero,
  titulo,
  isrc: `BRMUS${String(ano_gravacao).slice(2)}${String(id_musica).padStart(5, '0')}`,
  duracao,
  ano_gravacao,
  descricao,
  arquivo_audio: null,
  spotify_uri: null,
  youtube_video_id: null,
});

export const generos: GeneroMusicalDto[] = [
  { id_genero: 1, nome: 'Rock', descricao: null },
  { id_genero: 2, nome: 'Rock Progressivo', descricao: null },
  { id_genero: 3, nome: 'Tropicália', descricao: null },
  { id_genero: 4, nome: 'MPB', descricao: null },
  { id_genero: 5, nome: 'Pop', descricao: null },
  { id_genero: 6, nome: 'Jazz', descricao: null },
  { id_genero: 7, nome: 'Soul', descricao: null },
];

export const musicas: MusicaDto[] = [
  musica(1, 'Bohemian Rhapsody', 1, 1975, '00:05:55'),
  musica(2, 'Time', 2, 1973, '00:06:53'),
  musica(3, 'Dreams', 1, 1977, '00:04:17'),
  musica(
    4,
    'O Louco',
    3,
    1972,
    '00:04:45',
    'Registro de sessão com participação especial de Gal Costa, gravado em fita magnética.',
  ),
  musica(5, 'Expresso 2222', 3, 1972, '00:03:20'),
  musica(6, 'Smooth Operator', 5, 1984, '00:04:58'),
  musica(7, 'Careless Whisper', 5, 1984, '00:05:00'),
  musica(8, 'Every Breath You Take', 5, 1983, '00:04:13'),
  musica(9, 'Everybody Wants to Rule the World', 5, 1985, '00:04:11'),
  musica(10, 'Fly Me to the Moon', 6, 1964, '00:02:27'),
  musica(11, '"Heroes"', 1, 1977, '00:06:07'),
  musica(12, 'Feeling Good', 7, 1965, '00:02:57'),
  musica(13, 'Águas de Março', 4, 1974, '00:03:30'),
  musica(14, 'Vogue', 5, 1990, '00:05:17'),
  musica(15, 'Everybody Hurts', 1, 1992, '00:05:17'),
];

const artista = (id_artista: number, nome_artistico: string): ArtistaDto => ({
  id_artista,
  nome_artistico,
  nome_completo: null,
  biografia: null,
  data_nascimento: null,
  data_falecimento: null,
  foto_url: null,
});

export const artistas: ArtistaDto[] = [
  'Queen',
  'Pink Floyd',
  'Fleetwood Mac',
  'Novos Baianos',
  'Gal Costa',
  'Gilberto Gil',
  'Sade',
  'George Michael',
  'The Police',
  'Tears for Fears',
  'Frank Sinatra',
  'David Bowie',
  'Nina Simone',
  'Elis Regina',
  'Tom Jobim',
  'Armandinho Macedo',
  'Moraes Moreira',
  'Paulinho Boca de Cantor',
  'Dadi Carvalho',
  'Madonna',
  'R.E.M.',
].map((nome, i) => artista(i + 1, nome));

const link = (
  id_musica: number,
  id_artista: number,
  tipo_participacao: string,
): MusicaArtistaDto => ({ id_musica, id_artista, tipo_participacao });

// A ordem importa: os dois primeiros artistas aparecem ao lado do título.
export const musicaArtista: MusicaArtistaDto[] = [
  link(1, 1, 'Voz e banda'),
  link(2, 2, 'Banda'),
  link(3, 3, 'Banda'),
  link(4, 4, 'Banda'),
  link(4, 5, 'Participação especial'),
  link(4, 16, 'Compositor, Guitarra Baiana'),
  link(4, 17, 'Compositor, Cavaquinho Elétrico'),
  link(4, 18, 'Bateria'),
  link(4, 19, 'Baixo Acústico'),
  link(5, 6, 'Voz e violão'),
  link(6, 7, 'Voz'),
  link(7, 8, 'Voz'),
  link(8, 9, 'Banda'),
  link(9, 10, 'Banda'),
  link(10, 11, 'Voz'),
  link(11, 12, 'Voz'),
  link(12, 13, 'Voz e piano'),
  link(13, 14, 'Voz'),
  link(13, 15, 'Piano e voz'),
  link(14, 20, 'Voz'),
  link(15, 21, 'Banda'),
];

const trecho = (id_trecho: number, inicio: string, fim: string, texto: string): LetraTrechoDto => ({
  id_trecho,
  id_musica: 4,
  tempo_inicio: inicio,
  tempo_fim: fim,
  ordem: id_trecho,
  texto,
});

export const letraTrechos: LetraTrechoDto[] = [
  trecho(
    1,
    '00:00:20',
    '00:01:30',
    'Disseram por aí que eu perdi a razão,\nQue ando pelos campos a conversar com o vento...',
  ),
  trecho(
    2,
    '00:01:30',
    '00:03:10',
    'Mas o vento me sopra segredos do sertão,\nE o meu peito não cabe dentro do silêncio.',
  ),
  trecho(
    3,
    '00:03:10',
    '00:03:34',
    '“Se ser louco é buscar a mais pura harmonia,\nPrefiro a loucura à fria covardia!”',
  ),
  trecho(
    4,
    '00:03:34',
    '00:04:00',
    'Deixo a corda vibrar até o dia raiar,\nCom a viola no colo e a lua a testemunhar.',
  ),
  trecho(
    5,
    '00:04:00',
    '00:04:22',
    'Quem dita a ordem do que é sã melodia,\nNunca sentiu o pulsar da poesia viva...',
  ),
  trecho(6, '00:04:22', '00:04:45', '(Solo virtuosístico de Guitarra Baiana & Cavaquinho)'),
];

export const partituras: PartituraDto[] = [
  {
    id_item: 1,
    id_musica: 4,
    id_categoria: 1,
    titulo: 'Manuscrito Autógrafo #NB-72',
    descricao: 'Manuscrito original com anotações de arranjo.',
    origem: 'Doação da família do compositor',
    data_aquisicao: '1998-05-12',
    estado_conservacao: 'Restaurado',
    autor: 'Armandinho Macedo & Moraes Moreira',
    ano_criacao: 1972,
    arquivo_url: 'https://example.com/partituras/o-louco.pdf',
    id_usuario_cadastro: 1,
  },
];

export const usuarios: UsuarioDto[] = [
  {
    id_usuario: 1,
    nome: 'Arthur L. Silveira',
    email: 'arthur@museu.example',
    telefone: null,
    data_cadastro: '2026-01-10 09:00:00',
  },
];
export const perfisDoUsuario: Record<number, PerfilUsuarioDto[]> = {
  1: [{ id_perfil: 1, nome: 'Curador Associado' }],
};

export const favoritas: MusicaFavoritaDto[] = [10, 11, 12, 13].map((id_musica, i) => ({
  id_usuario: 1,
  id_musica,
  data_favoritada: `2026-10-0${i + 1} 10:00:00`,
}));

// Histórico: contagens diferentes geram o ranking de "Mais ouvidas"; as últimas linhas são as "Ouvidas recentemente".
export const historico: HistoricoMusicaDto[] = [];
const addPlays = (
  id_musica: number,
  vezes: number,
  dia: string,
  progresso: string | null = '00:00:30',
) => {
  for (let i = 0; i < vezes; i++) {
    historico.push({
      id_historico: historico.length + 1,
      id_usuario: 1,
      id_musica,
      data_reproducao: `${dia} 1${i % 10}:00:00`,
      progresso,
    });
  }
};
addPlays(1, 9, '2026-09-10');
addPlays(14, 9, '2026-09-10');
addPlays(2, 7, '2026-09-12');
addPlays(3, 6, '2026-09-14');
addPlays(4, 4, '2026-09-16');
addPlays(5, 4, '2026-09-18');
addPlays(4, 1, '2026-10-23', '00:03:10'); // última vez em O Louco parou em 03:10
addPlays(9, 1, '2026-10-24', '00:01:00');
addPlays(8, 1, '2026-10-24', '00:01:00');
addPlays(7, 1, '2026-10-24', '00:01:00');
addPlays(6, 1, '2026-10-24', '00:01:00');
historico.forEach((h, i) => {
  if (h.id_musica >= 6 && h.id_musica <= 9)
    h.data_reproducao = `2026-10-24 ${22 - (h.id_musica - 6)}:10:00`;
});

// ---------- Museu, salas e atividades (eventos) ----------
export const museu: MuseuDto = {
  id_museu: 1,
  nome: 'Museu da Música de Itu',
  descricao: 'Acervo de instrumentos, partituras e gravações históricas, com salas de escuta e programação de eventos.',
  endereco: 'Itu — SP',
  telefone: '(11) 0000-0000',
  email: 'contato@museu.example',
};

export const salas: SalaDto[] = [
  { id_sala: 1, id_museu: 1, nome: 'Sala 01', descricao: null, capacidade: 20 },
  { id_sala: 2, id_museu: 1, nome: 'Sala 02', descricao: 'Salão Nobre', capacidade: 40 },
  { id_sala: 3, id_museu: 1, nome: 'Sala 03', descricao: null, capacidade: 15 },
  { id_sala: 4, id_museu: 1, nome: 'Sala 04', descricao: null, capacidade: 30 },
];

const atividade = (
  id_atividade: number,
  titulo: string,
  descricao: string,
  tipo_atividade: string,
  status: string,
  data_inicio: string,
  data_fim_prevista: string,
  idSala: number,
): AtividadeDto => ({
  id_atividade, id_museu: 1, id_destino: null, titulo, descricao, tipo_atividade, status,
  data_inicio, data_fim_prevista, data_fim_real: null, local_externo: null,
  email_contato: 'contato@museu.example', telefone_contato: '(11) 0000-0000',
  salas: salas.filter((s) => s.id_sala === idSala).map((s) => ({ id_sala: s.id_sala, nome: s.nome })),
});

export const atividades: AtividadeDto[] = [
  atividade(1, 'Saraus e Recitais ao Piano de Cauda', 'Raridades gravadas ao vivo no Salão Nobre, em fitas originais de 1974.', 'Audição comentada', 'Em cartaz', '2026-11-05', '2026-11-30', 2),
  atividade(2, 'Noite da Tropicália 1968', 'Fitas de ensaio dos festivais da Record.', 'Sessão de escuta', 'Agendada', '2026-11-13', '2026-11-13', 4),
  atividade(3, 'Matrizes Raras de Bossa Nova', 'Prensagens mono originais da Odeon, de 1958.', 'Exposição', 'Agendada', '2026-11-14', '2026-11-14', 1),
  atividade(4, 'O Som de Bobina: Pink Floyd 1973', 'Master cut em 4 pistas dos estúdios de Abbey Road.', 'Sessão de escuta', 'Agendada', '2026-11-15', '2026-11-15', 3),
  atividade(5, 'Clube da Esquina: Gravações Noturnas', 'Voz e violão isolados em fita Scotch.', 'Recital', 'Agendada', '2026-11-17', '2026-11-17', 2),
];
