import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

interface NavLink {
  label: string;
  path: string;
}

interface DockItem extends NavLink {
  icon: string;
  /** Ícone preenchido (play/pause) em vez de traço. */
  filled?: boolean;
}

/**
 * Menu da aplicação.
 * Desktop (>= 1024px): marca, busca, links e perfil.
 * Mobile: barra inferior com notch que acompanha a rota ativa; o item central é o player (Tocando).
 */
@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  /** Nome e função do usuário (usuario.nome + perfil_usuario.nome). */
  readonly userName = input('Visitante');
  readonly userRole = input('Visitante');
  readonly searchChange = output<string>();

  /** Mesmos links no desktop e no mobile (o mobile ainda tem o player no centro). */
  protected readonly links: NavLink[] = [
    { label: 'Início', path: '/inicio' },
    { label: 'Descobrir', path: '/descobrir' },
    { label: 'Instrumentos', path: '/instrumentos' },
    { label: 'Perfil', path: '/perfil' },
  ];

  protected readonly tabs: DockItem[] = [
    { label: 'Início', path: '/inicio', icon: 'm2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
    {
      label: 'Descobrir', path: '/descobrir',
      icon: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253',
    },
    { label: 'Tocando', path: '/tocando', icon: 'M6 5h4v14H6V5zm8 0h4v14h-4V5z', filled: true },
    { label: 'Instrumentos', path: '/instrumentos', icon: 'M9 18V5l11-2v13M9 18a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 9 18Zm11-2a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 20 16Z' },
    {
      label: 'Perfil', path: '/perfil',
      icon: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
    },
  ];

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), map((e) => e.urlAfterRedirects)),
    { initialValue: this.router.url },
  );

  protected readonly activeIndex = computed(() => this.tabs.findIndex((t) => this.url().startsWith(t.path)));
  /** Centro do item ativo, em %: cada um dos 5 itens ocupa 20% da barra. */
  protected readonly notchX = computed(() => `${(Math.max(this.activeIndex(), 0) + 0.5) * (100 / this.tabs.length)}%`);
  protected readonly initials = computed(() =>
    this.userName().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
  );

  protected onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
