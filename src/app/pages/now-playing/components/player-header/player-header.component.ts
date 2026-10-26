import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-player-header',
  standalone: false,
  templateUrl: './player-header.component.html',
  styleUrl: './player-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerHeaderComponent {
  /** Gênero da música (genero_musical.nome). */
  readonly subtitle = input('Acervo');
  /** Formato do arquivo de áudio (extensão de musica.arquivo_audio), se houver. */
  readonly audioFormat = input<string | null>(null);
  readonly back = output<void>();
}
