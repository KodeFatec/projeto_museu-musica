import { ArtistaDto } from '../models/dto';
import { ArtistProfile } from '../models/artist.model';
import { parseDate } from '../utils/date-format';

export function toArtistProfile(dto: ArtistaDto): ArtistProfile {
  const name = dto.nome_artistico ?? dto.nome_completo ?? 'Artista';
  return {
    id: dto.id_artista,
    name,
    fullName: dto.nome_completo && dto.nome_completo !== name ? dto.nome_completo : undefined,
    biography: dto.biografia ?? undefined,
    photoUrl: dto.foto_url ?? undefined,
    birthDate: parseDate(dto.data_nascimento),
    deathDate: parseDate(dto.data_falecimento),
  };
}
