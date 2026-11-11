import { AtividadeDto, MuseuDto, SalaDto } from '../models/dto';
import { Museum, MuseumEvent, MuseumRoom } from '../models/event.model';
import { parseDate } from '../utils/date-format';

export function toEvent(dto: AtividadeDto): MuseumEvent {
  return {
    id: dto.id_atividade,
    title: dto.titulo,
    description: dto.descricao ?? undefined,
    type: dto.tipo_atividade ?? undefined,
    status: dto.status ?? undefined,
    startDate: parseDate(dto.data_inicio),
    // data_fim_real só existe depois que a atividade termina; antes, vale a prevista
    endDate: parseDate(dto.data_fim_real) ?? parseDate(dto.data_fim_prevista),
    externalPlace: dto.local_externo ?? undefined,
    rooms: (dto.salas ?? []).map((s) => s.nome),
    contactEmail: dto.email_contato ?? undefined,
    contactPhone: dto.telefone_contato ?? undefined,
  };
}

export function toMuseum(dto: MuseuDto): Museum {
  return {
    id: dto.id_museu,
    name: dto.nome,
    description: dto.descricao ?? undefined,
    address: dto.endereco ?? undefined,
    phone: dto.telefone ?? undefined,
    email: dto.email ?? undefined,
  };
}

export function toRoom(dto: SalaDto): MuseumRoom {
  return {
    id: dto.id_sala,
    name: dto.nome,
    description: dto.descricao ?? undefined,
    capacity: dto.capacidade ?? undefined,
  };
}
