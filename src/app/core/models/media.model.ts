export type MediaFormat = 'vinyl' | 'cassette';

/** Selo central do vinil (todo o conteúdo é derivado dos campos da música). */
export interface VinylLabel {
  bg: string;
  fg: string;
  ring: string;
  lines: string[];
}

/** Dados impressos na fita K7 (derivados dos campos da música). */
export interface CassetteSpec {
  heading: string;
  side: string;
  counter: string;
  specs: [string, string, string];
  badge: string;
  shell: string;
}
