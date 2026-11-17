/** Ficha do artista (`artista`). */
export interface ArtistProfile {
  id: number;
  name: string;
  /** nome_completo, quando diferente do nome artístico. */
  fullName?: string;
  biography?: string;
  photoUrl?: string;
  birthDate?: Date;
  deathDate?: Date;
}

/** Quantas obras do artista aparecem em cada formato (regra do ano). */
export interface ArtistStats {
  works: number;
  vinyl: number;
  cassette: number;
  cd: number;
}
