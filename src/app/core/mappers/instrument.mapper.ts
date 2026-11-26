import { InstrumentoDetalheDto, InstrumentoDto, ItemLocalizacaoDto, MidiaDto } from '../models/dto';
import { Instrument, InstrumentDetail, InstrumentMedia, ItemLocation, MediaKind } from '../models/instrument.model';
import { toEvent } from './event.mapper';
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

/** Descobre o tipo do arquivo pelo `tipo_midia` (texto livre) e, se não bastar, pela extensão. */
function mediaKind(media: MidiaDto): MediaKind {
  const type = (media.tipo_midia ?? '').toLowerCase();
  const url = media.arquivo_url.split('?')[0].toLowerCase();
  if (/imagem|image|foto|photo/.test(type) || /\.(jpe?g|png|webp|gif|avif|svg)$/.test(url) || url.startsWith('data:image')) return 'image';
  if (/[aá]udio|audio|som|mp3|wav|ogg/.test(type) || /\.(mp3|wav|ogg|flac|m4a)$/.test(url)) return 'audio';
  if (/v[ií]deo|video|mp4|webm/.test(type) || /\.(mp4|webm|mov)$/.test(url)) return 'video';
  return 'document';
}

export function toInstrumentMedia(media: MidiaDto): InstrumentMedia {
  return { id: media.id_midia, kind: mediaKind(media), url: media.arquivo_url, description: media.descricao ?? undefined };
}

export function toItemLocation(dto: ItemLocalizacaoDto, today: Date = new Date()): ItemLocation {
  const since = parseDate(dto.data_inicio);
  const until = parseDate(dto.data_fim);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return {
    id: dto.id_localizacao,
    roomName: dto.sala?.nome ?? `Sala ${dto.id_sala}`,
    roomDescription: dto.sala?.descricao ?? undefined,
    since,
    until,
    current: !until || until >= startOfToday,
  };
}

export function toInstrumentDetail(dto: InstrumentoDetalheDto): InstrumentDetail {
  return {
    ...toInstrument(dto),
    media: (dto.midias ?? []).map(toInstrumentMedia),
    // a sala atual primeiro; depois as anteriores, da mais recente para a mais antiga
    locations: (dto.localizacoes ?? [])
      .map((l) => toItemLocation(l))
      .sort((a, b) => Number(b.current) - Number(a.current) || (b.since?.getTime() ?? 0) - (a.since?.getTime() ?? 0)),
    events: (dto.atividades ?? [])
      .map(toEvent)
      .sort((a, b) => (b.startDate?.getTime() ?? 0) - (a.startDate?.getTime() ?? 0)),
  };
}
