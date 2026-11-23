import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Cartão de coleção (década ou tipo de instrumento). A cor muda pelo `tone` (0 a 5). */
@Component({
  selector: 'app-collection-card',
  standalone: false,
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardComponent {
  readonly title = input.required<string>();
  readonly count = input.required<number>();
  readonly unit = input('');
  readonly tone = input(0);
  readonly choose = output<void>();
}
