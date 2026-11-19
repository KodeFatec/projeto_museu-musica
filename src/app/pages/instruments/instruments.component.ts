import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { InstrumentSort, InstrumentsService } from '../../core/services/instruments.service';
import { LibraryService } from '../../core/services/library.service';
import { ChipOption } from '../../shared/filter-chips/filter-chips.component';

@Component({
  selector: 'app-instruments',
  standalone: false,
  templateUrl: './instruments.component.html',
  styleUrl: './instruments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentsComponent implements OnInit {
  protected readonly instruments = inject(InstrumentsService);
  protected readonly library = inject(LibraryService);
  protected readonly sorts: { id: InstrumentSort; label: string }[] = [
    { id: 'name', label: 'Nome (A-Z)' }, { id: 'oldest', label: 'Mais antigos primeiro' },
    { id: 'newest', label: 'Mais recentes primeiro' }, { id: 'maker', label: 'Fabricante (A-Z)' },
  ];
  protected readonly chips = computed<ChipOption[]>(() => [
    { id: 'all', label: 'Todos', count: this.instruments.instruments().length },
    ...this.instruments.types().map((type) => ({ id: type.type, label: type.type, count: type.count })),
  ]);

  ngOnInit(): void { void this.instruments.load(); }
  protected onType(id: string): void { this.instruments.type.set(id === 'all' ? null : id); }
  protected onSort(event: Event): void { this.instruments.sort.set((event.target as HTMLSelectElement).value as InstrumentSort); }
  protected retry(): void { void this.instruments.reload(); }
}
