import { Track } from '../models/track.model';

/** "Novos Baianos • Gal Costa": os dois primeiros artistas ligados à música. */
export function artistLine(track: Track): string {
  const names = [...new Set(track.artists.map((a) => a.name))].slice(0, 2);
  return names.length ? names.join(' • ') : 'Artista não informado';
}

/** Compositores: artistas cuja participação contém "Compositor". */
export function composersOf(track: Track): string {
  return track.artists
    .filter((a) => a.role?.toLowerCase().includes('compositor'))
    .map((a) => a.name)
    .join(' & ');
}

/** Extensão do arquivo de áudio em maiúsculas ("FLAC", "MP3") ou null. */
export function audioFormatOf(track: Track): string | null {
  const match = track.audioUrl?.split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  return match ? match[1].toUpperCase() : null;
}
