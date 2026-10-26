import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VinylLabel } from '../../core/models/media.model';

/** Disco de vinil. O prato (ranhuras + selo) gira; o brilho da luz fica parado. */
@Component({
  selector: 'app-vinyl-disc',
  standalone: false,
  templateUrl: './vinyl-disc.component.html',
  styleUrl: './vinyl-disc.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VinylDiscComponent {
  readonly label = input.required<VinylLabel>();
  readonly spinning = input(false);
}
