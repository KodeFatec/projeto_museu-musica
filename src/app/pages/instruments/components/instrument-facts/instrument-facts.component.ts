import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Instrument } from '../../../../core/models/instrument.model';
import { dateRange } from '../../../../core/utils/date-format';

/** Ficha do item: cada informação que o banco guarda sobre o instrumento, em cartões. */
@Component({
  selector: 'app-instrument-facts',
  standalone: false,
  templateUrl: './instrument-facts.component.html',
  styleUrl: './instrument-facts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentFactsComponent {
  readonly instrument = input.required<Instrument>();

  /** Só os campos preenchidos (instrumento + item_acervo). */
  protected readonly facts = computed(() => {
    const i = this.instrument();
    return [
      { label: 'Tipo de instrumento', value: i.type },
      { label: 'Fabricante', value: i.maker },
      { label: 'Ano de fabricação', value: i.year ? String(i.year) : undefined },
      { label: 'Estado de conservação', value: i.condition },
      { label: 'Origem', value: i.origin },
      { label: 'Adquirido em', value: i.acquiredAt ? dateRange(i.acquiredAt) : undefined },
      { label: 'Antigo dono', value: i.formerOwner },
    ].filter((f): f is { label: string; value: string } => !!f.value);
  });
}
