/** Evento do museu (`atividade` + salas ligadas por `atividade_sala`). */
export interface MuseumEvent {
  id: number;
  title: string;
  description?: string;
  /** tipo_atividade: "Audição comentada", "Recital"... */
  type?: string;
  /** status: "Em cartaz", "Agendada"... */
  status?: string;
  startDate?: Date;
  endDate?: Date;
  /** local_externo, quando a atividade acontece fora do museu. */
  externalPlace?: string;
  rooms: string[];
  contactEmail?: string;
  contactPhone?: string;
}

/** Dados de contato do museu (`museu`). */
export interface Museum {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface MuseumRoom {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
}

/** Artista com o resumo mostrado na tela inicial. */
export interface ArtistSummary {
  id: number;
  name: string;
  photoUrl?: string;
  trackCount: number;
  /** Gênero da música mais ouvida (ou a primeira) do artista. */
  genre?: string;
  /** Música tocada ao clicar no artista. */
  topTrackId: number;
}
