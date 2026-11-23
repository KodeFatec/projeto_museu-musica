import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CassetteSpec, VinylLabel } from '../../../../core/models/media.model';
import { PhysicalCollection } from '../../../../core/services/explore.service';

/** Cartão do "Acervo físico do museu": mostra o disco, a fita ou o CD do formato (ou um ícone). */
@Component({
  selector: 'app-physical-card',
  standalone: false,
  templateUrl: './physical-card.component.html',
  styleUrl: './physical-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhysicalCardComponent {
  readonly item = input.required<PhysicalCollection>();
  readonly choose = output<void>();

  // arte genérica: o formato é o que importa aqui, não uma música específica
  protected readonly label: VinylLabel = { bg: '#272118', fg: '#F0E6D2', ring: '#D8A748', lines: [] };
  protected readonly tape: CassetteSpec = {
    heading: 'ACERVO', side: '', counter: 'K7', specs: ['', '', ''], badge: '', shell: '#2b302c',
  };
}
