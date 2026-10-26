import { CassetteSpec, MediaFormat, VinylLabel } from '../models/media.model';
import { Track } from '../models/track.model';
import { formatClock } from './time';
import { artistLine } from './track-presenter';

/** Até este ano a faixa aparece em vinil; a partir de 1980, em fita K7. Sem ano = acervo antigo (vinil). */
export const VINYL_LIMIT_YEAR = 1979;

export function formatByYear(year: number | null): MediaFormat {
  return year === null || year <= VINYL_LIMIT_YEAR ? 'vinyl' : 'cassette';
}

// O banco não guarda cores. Elas vêm de uma paleta, escolhida pelo id da música (sempre a mesma por faixa).
const PALETTES = [
  { bg: '#A23725', fg: '#FFF4DE', ring: '#F1D69D', shell: '#2F3E32', sleeve: '#2E2825' },
  { bg: '#D4B574', fg: '#33220E', ring: '#544122', shell: '#2B231D', sleeve: '#1B1F24' },
  { bg: '#1F6B54', fg: '#F5EBD0', ring: '#D8C48A', shell: '#1C1C1E', sleeve: '#2A1D18' },
  { bg: '#272118', fg: '#F0E6D2', ring: '#D8A748', shell: '#2B302C', sleeve: '#2B1F19' },
  { bg: '#B2382D', fg: '#FFFFFF', ring: '#1A1918', shell: '#33302B', sleeve: '#24211D' },
  { bg: '#3F7D5C', fg: '#FFFFFF', ring: '#1A1918', shell: '#2A2F36', sleeve: '#2C2420' },
];

const paletteOf = (track: Track) => PALETTES[track.id % PALETTES.length];

const shorten = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export function vinylLabelOf(track: Track): VinylLabel {
  const p = paletteOf(track);
  return {
    bg: p.bg, fg: p.fg, ring: p.ring,
    lines: [(track.genre ?? 'Museu').toUpperCase().slice(0, 14), shorten(track.title, 16), track.year ? String(track.year) : ''].filter(Boolean),
  };
}

export function cassetteOf(track: Track): CassetteSpec {
  const year = track.year ? String(track.year) : 's/d';
  return {
    heading: shorten(`${artistLine(track)} - ${track.title}`.toUpperCase(), 34),
    side: year,
    counter: `K7-${track.id.toString().padStart(3, '0')}`,
    specs: [(track.genre ?? 'Acervo').toUpperCase(), year, formatClock(track.durationSeconds)],
    badge: track.isrc ?? '',
    shell: paletteOf(track).shell,
  };
}

export const sleeveColorOf = (track: Track) => paletteOf(track).sleeve;
