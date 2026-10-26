/** Quem participa da gravação: `artista` + `musica_artista.tipo_participacao`. */
export interface TrackArtist {
  id: number;
  name: string;
  fullName?: string;
  /** tipo_participacao: "Voz", "Guitarra Baiana", "Compositor"... */
  role?: string;
  photoUrl?: string;
}

/** Música como a interface usa (`musica` + `genero_musical` + artistas). */
export interface Track {
  id: number;
  title: string;
  /** ano_gravacao; define se aparece como vinil ou fita K7. */
  year: number | null;
  durationSeconds: number;
  isrc?: string;
  description?: string;
  genre?: string;
  audioUrl?: string;
  spotifyUri?: string;
  youtubeVideoId?: string;
  artists: TrackArtist[];
}

/** Um trecho da letra (`letra_trecho`), já com tempos em segundos. */
export interface LyricVerse {
  id: number;
  order: number;
  start: number;
  end: number;
  lines: string[];
  /** Trecho entre parênteses, ex.: "(Solo de guitarra)". */
  instrumental: boolean;
}

/** Partitura do acervo (`partitura` + `item_acervo`). */
export interface ScoreSheet {
  itemId: number;
  title: string;
  description?: string;
  origin?: string;
  condition?: string;
  author?: string;
  year?: number;
  fileUrl?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email?: string;
  /** perfil_usuario.nome (ex.: "Curador Associado"). */
  role: string;
}
