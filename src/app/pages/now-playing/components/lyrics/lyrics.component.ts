import { ChangeDetectionStrategy, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { LyricVerse } from '../../../../core/models/track.model';
import { formatClock } from '../../../../core/utils/time';

/** Letra sincronizada (letra_trecho): o trecho atual fica em destaque e o scroll o acompanha. */
@Component({
  selector: 'app-lyrics',
  standalone: false,
  templateUrl: './lyrics.component.html',
  styleUrl: './lyrics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LyricsComponent {
  readonly verses = input.required<LyricVerse[]>();
  readonly currentIndex = input(-1);
  readonly composers = input('');
  readonly note = input('');

  private readonly list = viewChild<ElementRef<HTMLElement>>('list');

  constructor() {
    effect(() => {
      const index = this.currentIndex();
      const list = this.list()?.nativeElement;
      if (!list || index < 0) return;
      // rola só a lista (não a página); no mobile a lista não rola, então não faz nada
      setTimeout(() => {
        const el = list.querySelector<HTMLElement>('.is-current');
        if (el) list.scrollTo({ top: el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2, behavior: 'smooth' });
      });
    });
  }

  protected time(seconds: number): string {
    return formatClock(seconds);
  }

  /** Trechos vizinhos do atual (no mobile só eles aparecem). */
  protected isNear(index: number): boolean {
    return Math.abs(index - Math.max(this.currentIndex(), 0)) <= 1;
  }

  /** Quanto mais longe do trecho atual, mais apagado. */
  protected opacity(index: number): number {
    const distance = Math.abs(index - Math.max(this.currentIndex(), 0));
    return [1, 0.65, 0.45][distance] ?? 0.28;
  }
}
