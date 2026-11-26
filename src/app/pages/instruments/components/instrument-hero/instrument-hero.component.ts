import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { InstrumentDetail, InstrumentMedia } from '../../../../core/models/instrument.model';

/** Topo do detalhe: foto principal, tipo, título, descrição e números rápidos do instrumento. */
@Component({
  selector: 'app-instrument-hero',
  standalone: false,
  templateUrl: './instrument-hero.component.html',
  styleUrl: './instrument-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentHeroComponent {
  readonly instrument = input.required<InstrumentDetail>();
  readonly photo = input<InstrumentMedia>();
  /** Texto do botão de compartilhar ("Compartilhar ficha" / "Link copiado!"). */
  readonly shareLabel = input('Compartilhar ficha');
  readonly share = output<void>();

  /** "#ITEM-004" (id do item_acervo). */
  protected readonly code = computed(() => `#ITEM-${String(this.instrument().id).padStart(3, '0')}`);
  /** Título grande: o tipo ("PIANO"); sem tipo, o próprio título do item. */
  protected readonly heading = computed(() => this.instrument().type ?? this.instrument().title);
  /** Subtítulo: título do item e o ano, se o tipo já ocupou o título grande. */
  protected readonly subtitle = computed(() => {
    const { type, title, year } = this.instrument();
    if (!type) return year ? `(${year})` : '';
    return year ? `${title} (${year})` : title;
  });
  protected readonly quick = computed(() => {
    const { year, maker, condition } = this.instrument();
    return [
      { label: 'Ano de fabricação', value: year ? String(year) : '' },
      { label: 'Fabricante', value: maker ?? '' },
      { label: 'Conservação', value: condition ?? '' },
    ].filter((f) => f.value);
  });
}
