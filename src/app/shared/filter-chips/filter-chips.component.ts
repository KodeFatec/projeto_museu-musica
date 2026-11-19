import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ChipOption {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-filter-chips',
  standalone: false,
  template: `
    <div class="chips" role="group" [attr.aria-label]="label()">
      @for (option of options(); track option.id) {
        <button type="button" [class.selected]="option.id === value()" (click)="valueChange.emit(option.id)">
          {{ option.label }}@if (option.count !== undefined) { ({{ option.count }}) }
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    .chips { display: flex; gap: .5rem; overflow-x: auto; padding: .15rem 0 .4rem; }
    button { flex: none; padding: .55rem 1rem; border: 1px solid rgba(197,154,69,.3); border-radius: 999px; background: #fffdf8; color: var(--ink); cursor: pointer; }
    button.selected { border-color: var(--ink); background: var(--ink); color: #fff; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  readonly options = input.required<ChipOption[]>();
  readonly value = input.required<string>();
  readonly label = input('Filtros');
  readonly valueChange = output<string>();
}
