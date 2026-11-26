import { MuseumEvent } from './event.model';

export interface Instrument {
  id: number;
  title: string;
  description?: string;
  type?: string;
  condition?: string;
  origin?: string;
  maker?: string;
  year?: number;
  formerOwner?: string;
  acquiredAt?: Date;
  photoUrl?: string;
  audioUrl?: string;
}

export type MediaKind = 'image' | 'audio' | 'video' | 'document';

/** Arquivo do instrumento (`midia`). */
export interface InstrumentMedia {
  id: number;
  kind: MediaKind;
  url: string;
  /** midia.descricao */
  description?: string;
}

/** Sala onde o instrumento esteve (`item_localizacao` + `sala`). */
export interface ItemLocation {
  id: number;
  roomName: string;
  roomDescription?: string;
  since?: Date;
  until?: Date;
  /** Ainda está nesta sala. */
  current: boolean;
}

/** Tudo o que o banco guarda sobre um instrumento, para a tela de detalhe. */
export interface InstrumentDetail extends Instrument {
  media: InstrumentMedia[];
  locations: ItemLocation[];
  events: MuseumEvent[];
}
