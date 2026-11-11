import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MuseumEvent } from '../../../../core/models/event.model';
import { dateRange, weekdayAndDate } from '../../../../core/utils/date-format';

/**
 * Evento do museu (`atividade`). No mobile é um cartão de carrossel; no desktop vira o destaque (hero).
 * Só mostra o que existe no banco: status, sala, tipo, datas, descrição e contato.
 */
@Component({
  selector: 'app-event-card',
  standalone: false,
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  readonly event = input.required<MuseumEvent>();

  /** "Em cartaz • Sala 02" */
  protected readonly badge = computed(() => {
    const e = this.event();
    return [e.status, e.rooms.join(' / ')].filter(Boolean).join(' • ');
  });
  protected readonly when = computed(() => {
    const start = this.event().startDate;
    return start ? weekdayAndDate(start) : '';
  });
  protected readonly period = computed(() => dateRange(this.event().startDate, this.event().endDate));
}
