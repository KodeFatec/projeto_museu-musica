import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Cabeçalho + linha de itens: carrossel no mobile, grade no desktop. */
@Component({
  selector: 'app-library-section',
  standalone: false,
  templateUrl: './library-section.component.html',
  styleUrl: './library-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibrarySectionComponent {
  readonly title = input.required<string>();
  readonly shortTitle = input<string>();
  readonly subtitle = input<string>();
  readonly action = input<string>();
  readonly shortAction = input<string>();
  readonly accent = input<'gold' | 'olive' | 'heart'>('gold');
  /** Largura mínima de cada item na grade (desktop). */
  readonly minItem = input('13rem');
  /** Largura de cada item no carrossel (mobile). */
  readonly mobileItem = input('8rem');
}
