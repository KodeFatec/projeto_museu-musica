import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { InstrumentDetailService } from '../../core/services/instrument-detail.service';

/** Tela de detalhe do instrumento: /instrumentos/:id (aberta ao clicar num instrumento da listagem). */
@Component({
  selector: 'app-instrument-detail',
  standalone: false,
  templateUrl: './instrument-detail.component.html',
  styleUrl: './instrument-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentDetailComponent {
  protected readonly detail = inject(InstrumentDetailService);
  private readonly router = inject(Router);

  /** A primeira foto vira a foto principal; as demais mídias vão para a galeria. */
  protected readonly photo = computed(() => this.detail.detail()?.media.find((m) => m.kind === 'image'));
  protected readonly others = computed(() => (this.detail.detail()?.media ?? []).filter((m) => m !== this.photo()));

  protected readonly copied = signal(false);

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => void this.detail.load(Number(params.get('id'))));
  }

  /** Volta para a tela anterior; se a página foi aberta direto, vai para a listagem. */
  protected goBack(): void {
    if ((globalThis.history?.length ?? 0) > 1) globalThis.history.back();
    else void this.router.navigate(['/instrumentos']);
  }

  /** Compartilha o link da ficha (menu do aparelho) ou, sem isso, copia o link. */
  protected async share(): Promise<void> {
    const item = this.detail.detail();
    const url = globalThis.location?.href;
    if (!item || !url) return;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: item.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* compartilhamento cancelado ou sem permissão */
    }
  }
}
