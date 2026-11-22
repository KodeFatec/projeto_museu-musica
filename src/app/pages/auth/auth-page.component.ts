import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { HomeService } from '../../core/services/home.service';

/**
 * Casca de /login e /cadastro: painel da marca (com números do acervo) + o formulário escolhido pela rota.
 * O login e o cadastro compartilham esta base, o campo (app-auth-field) e as validações.
 */
@Component({
  selector: 'app-auth-page',
  standalone: false,
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly home = inject(HomeService);

  /** 'login' ou 'register' (vem de `data` na rota). */
  protected readonly mode = inject(ActivatedRoute).snapshot.data['mode'] as 'login' | 'register';
  protected readonly year = new Date().getFullYear();

  /** Números reais do acervo (músicas, artistas e salas), só os que já carregaram. */
  protected readonly stats = computed(() =>
    [
      { label: 'Músicas catalogadas', value: this.catalog.tracks().length },
      { label: 'Artistas', value: this.home.artistsAll().length },
      { label: 'Salas', value: this.home.rooms().length },
    ].filter((s) => s.value > 0),
  );

  ngOnInit(): void {
    void this.home.load();
  }
}
