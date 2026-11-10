import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VinylLabel } from '../../core/models/media.model';

/** CD: face prateada com reflexo, área impressa (mesmo selo do vinil), anel de plástico e furo central. */
@Component({
  selector: 'app-cd-disc',
  standalone: false,
  templateUrl: './cd-disc.component.html',
  styleUrl: './cd-disc.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdDiscComponent {
  readonly label = input.required<VinylLabel>();
  readonly spinning = input(false);
  /** Disco de ouro: música entre as mais escutadas (CD dourado). */
  readonly gold = input(false);
}
