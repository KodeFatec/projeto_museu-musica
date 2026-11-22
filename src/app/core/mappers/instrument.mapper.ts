import { InstrumentoDto } from '../models/dto';
import { Instrument } from '../models/instrument.model';
import { parseDate } from '../utils/date-format';

export function toInstrument(dto: InstrumentoDto): Instrument {
  return {
    id: dto.id_item,
    title: dto.titulo,
    description: dto.descricao ?? undefined,
    type: dto.tipo_instrumento ?? undefined,
    condition: dto.estado_conservacao ?? undefined,
    origin: dto.origem ?? undefined,
    maker: dto.fabricante ?? undefined,
    year: dto.ano_fabricacao ?? undefined,
    formerOwner: dto.antigo_dono ?? undefined,
    acquiredAt: parseDate(dto.data_aquisicao),
    photoUrl: dto.midias?.find((media) => /imagem|image|foto|photo/i.test(media.tipo_midia ?? ''))?.arquivo_url,
    audioUrl: dto.midias?.find((media) => /audio|som|mp3|wav|ogg/i.test(media.tipo_midia ?? ''))?.arquivo_url,
  };
}
