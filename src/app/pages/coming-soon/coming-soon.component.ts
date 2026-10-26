import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** Tela provisória das seções que ainda não foram desenhadas (Descobrir, Instrumentos, Perfil). */
@Component({
  selector: 'app-coming-soon',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="soon">
      <h1>{{ title }}</h1>
      <p>Esta área ainda está em construção.</p>
    </section>
  `,
  styles: `
    :host { display: block; flex: none; }
    .soon { padding: 3rem 1.5rem 10rem; text-align: center; }
    h1 { margin: 0; font: 600 2rem var(--font-serif); color: var(--olive-900); }
    p { margin: 0.5rem 0 0; font: italic 400 1.1rem var(--font-serif); color: var(--muted); }
  `,
})
export class ComingSoonComponent {
  protected readonly title: string;

  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data['title'] ?? 'Em breve';
  }
}
