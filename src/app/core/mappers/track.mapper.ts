import {
  ArtistaDto,
  GeneroMusicalDto,
  LetraTrechoDto,
  MusicaArtistaDto,
  MusicaDto,
  PartituraDto,
  PerfilUsuarioDto,
  UsuarioDto,
} from '../models/dto';
import { LyricVerse, ScoreSheet, Track, TrackArtist, UserProfile } from '../models/track.model';
import { parseTime } from '../utils/time';

export function toTrack(
  musica: MusicaDto,
  genres: Map<number, GeneroMusicalDto>,
  artists: Map<number, ArtistaDto>,
  links: MusicaArtistaDto[],
): Track {
  const trackArtists = links
    .filter((l) => l.id_musica === musica.id_musica)
    .map((l): TrackArtist | null => {
      const a = artists.get(l.id_artista);
      if (!a) return null;
      return {
        id: a.id_artista,
        name: a.nome_artistico ?? a.nome_completo ?? 'Artista',
        fullName: a.nome_completo ?? undefined,
        role: l.tipo_participacao ?? undefined,
        photoUrl: a.foto_url ?? undefined,
      };
    })
    .filter((a): a is TrackArtist => a !== null);

  return {
    id: musica.id_musica,
    title: musica.titulo,
    year: musica.ano_gravacao,
    durationSeconds: parseTime(musica.duracao),
    isrc: musica.isrc ?? undefined,
    description: musica.descricao ?? undefined,
    genre: musica.id_genero ? genres.get(musica.id_genero)?.nome : undefined,
    audioUrl: musica.arquivo_audio ?? undefined,
    spotifyUri: musica.spotify_uri ?? undefined,
    youtubeVideoId: musica.youtube_video_id ?? undefined,
    artists: trackArtists,
  };
}

export function toVerse(dto: LetraTrechoDto): LyricVerse {
  const text = dto.texto.trim();
  return {
    id: dto.id_trecho,
    order: dto.ordem,
    start: parseTime(dto.tempo_inicio),
    end: parseTime(dto.tempo_fim),
    lines: text.split(/\r?\n/).filter((line) => line.trim()),
    instrumental: /^\(.*\)$/s.test(text),
  };
}

export function toScore(dto: PartituraDto): ScoreSheet {
  return {
    itemId: dto.id_item,
    title: dto.titulo,
    description: dto.descricao ?? undefined,
    origin: dto.origem ?? undefined,
    condition: dto.estado_conservacao ?? undefined,
    author: dto.autor ?? undefined,
    year: dto.ano_criacao ?? undefined,
    fileUrl: dto.arquivo_url ?? undefined,
  };
}

export function toUserProfile(user: UsuarioDto, roles: PerfilUsuarioDto[]): UserProfile {
  return {
    id: user.id_usuario,
    name: user.nome,
    email: user.email,
    role: roles[0]?.nome ?? 'Visitante',
  };
}
