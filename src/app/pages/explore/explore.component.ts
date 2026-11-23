import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreQuery, toQueryParams } from '../../core/models/explore-query.model';
import { Collection, decadeLabel, ExploreService, PhysicalCollection } from '../../core/services/explore.service';
import { HomeService } from '../../core/services/home.service';
import { LibraryService } from '../../core/services/library.service';
import { SearchFieldComponent } from '../../shared/search-field/search-field.component';

/**
 * Tela "Descobrir": mostra as coleções do acervo. Clicar numa coleção ou pesquisar leva para a tela de
 * resultados (ainda por criar), passando os critérios pela URL: /descobrir/resultados?decada=1970.
 */
@Component({
  selector: 'app-explore',
  standalone: false,
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit {
  protected readonly explore = inject(ExploreService);
  protected readonly library = inject(LibraryService);
  protected readonly home = inject(HomeService);
  private readonly router = inject(Router);

  private readonly search = viewChild(SearchFieldComponent);

  ngOnInit(): void {
    void this.explore.load();
    void this.home.load();
  }

  protected readonly decadeChips = () =>
    this.explore.decades().map((d) => ({ id: String(d.decade), label: decadeLabel(d.decade), count: d.count }));

  /** Ctrl+K (ou Cmd+K) leva o cursor para a busca. */
  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.search()?.focus();
    }
  }

  protected onSearchText(text: string): void {
    this.library.query.set(text);
  }

  /** "Localizar" ou Enter: vai para os resultados; sem texto nem filtro, só devolve o cursor ao campo. */
  protected submitSearch(): void {
    const query = this.explore.forSearch();
    if (query) this.openResults(query);
    else this.search()?.focus();
  }

  protected pickCollection(collection: Collection): void {
    this.openResults(this.explore.forCollection(collection));
  }

  protected pickPhysical(item: PhysicalCollection): void {
    this.openResults(this.explore.forPhysical(item));
  }

  protected pickDecade(id: string): void {
    this.openResults(this.explore.forDecade(Number(id)));
  }

  private openResults(query: ExploreQuery): void {
    void this.router.navigate(['/descobrir/resultados'], { queryParams: toQueryParams(query) });
  }
}
