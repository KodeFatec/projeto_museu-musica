import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ItemLocation } from '../../../../core/models/instrument.model';
import { dateRange } from '../../../../core/utils/date-format';

/** Onde o instrumento está no museu e por quais salas já passou (`item_localizacao` + `sala`). */
@Component({
  selector: 'app-instrument-locations',
  standalone: false,
  templateUrl: './instrument-locations.component.html',
  styleUrl: './instrument-locations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentLocationsComponent {
  readonly locations = input.required<ItemLocation[]>();

  /** "desde 12/05/2020" ou "01/06/1998 – 12/05/2020". */
  protected period(location: ItemLocation): string {
    if (!location.since) return '';
    return location.current && !location.until
      ? `desde ${dateRange(location.since)}`
      : dateRange(location.since, location.until);
  }
}
