import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CassetteSpec } from '../../core/models/media.model';

/** Fita K7 grande: os carretéis giram enquanto a faixa toca. */
@Component({
  selector: 'app-cassette-tape',
  standalone: false,
  templateUrl: './cassette-tape.component.html',
  styleUrl: './cassette-tape.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CassetteTapeComponent {
  readonly spec = input.required<CassetteSpec>();
  readonly spinning = input(false);
}
