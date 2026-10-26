import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LibraryService } from './core/services/library.service';
import { PlayerService } from './core/services/player.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected readonly user = inject(UserService);
  protected readonly player = inject(PlayerService);
  private readonly library = inject(LibraryService);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), map((e) => e.urlAfterRedirects)),
    { initialValue: this.router.url },
  );
  /** O mini player some na própria tela Tocando. */
  protected readonly showMiniPlayer = computed(() => !!this.player.track() && !this.url().startsWith('/tocando'));

  ngOnInit(): void {
    void this.user.load();
    void this.library.load();
  }

  /** A busca do menu filtra a biblioteca; fora do Início, leva para lá. */
  protected onSearch(query: string): void {
    this.library.query.set(query);
    if (!this.router.url.startsWith('/inicio')) void this.router.navigate(['/inicio']);
  }
}
