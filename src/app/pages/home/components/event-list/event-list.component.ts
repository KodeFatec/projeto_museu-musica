import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MuseumEvent } from '../../../../core/models/event.model';
import { weekdayAndDate } from '../../../../core/utils/date-format';

/** Lista "Próximos recitais & sessões" (só desktop): escolhe qual evento aparece no destaque. */
@Component({
  selector: 'app-event-list',
  standalone: false,
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {
  readonly events = input.required<MuseumEvent[]>();
  readonly activeIndex = input(0);
  readonly choose = output<number>();

  protected when(event: MuseumEvent): string {
    return event.startDate ? weekdayAndDate(event.startDate) : '';
  }
}
