import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';

/** Campo de busca em pílula (mesmo visual do cabeçalho mobile da Biblioteca). */
@Component({
  selector: 'app-search-field',
  standalone: false,
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent {
  readonly placeholder = input('Buscar...');
  readonly value = input('');
  readonly valueChange = output<string>();
  /** Enter dentro do campo. */
  readonly submitted = output<string>();
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  /** Leva o cursor para o campo (ex.: atalho Ctrl+K). */
  focus(): void {
    this.field()?.nativeElement.focus();
  }

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
