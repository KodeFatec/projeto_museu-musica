import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MuseumEvent } from '../../../../core/models/event.model';
import { elapsed, shortDate } from '../../../../core/utils/date-format';

/** Linha do tempo "Eventos & Memória": atividades do museu ligadas às obras do artista. */
@Component({
  selector: 'app-artist-timeline',
  standalone: false,
  templateUrl: './artist-timeline.component.html',
  styleUrl: './artist-timeline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTimelineComponent {
  readonly events = input.required<MuseumEvent[]>();
  /** Mensagem quando não há eventos. */
  readonly emptyText = input('Nenhum evento do museu ligado às obras deste artista.');

  protected date(event: MuseumEvent): string {
    return event.startDate ? shortDate(event.startDate) : '';
  }

  protected since(event: MuseumEvent): { amount: string; unit: string } | null {
    return event.startDate ? elapsed(event.startDate) : null;
  }
}
