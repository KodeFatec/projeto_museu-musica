import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Museum, MuseumRoom } from '../../../../core/models/event.model';

/** Faixa "Visite o museu": dados do museu (`museu`) e salas (`sala`), com contato por telefone e e-mail. */
@Component({
  selector: 'app-museum-banner',
  standalone: false,
  templateUrl: './museum-banner.component.html',
  styleUrl: './museum-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MuseumBannerComponent {
  readonly museum = input.required<Museum>();
  readonly rooms = input<MuseumRoom[]>([]);
  readonly capacity = input(0);
}
