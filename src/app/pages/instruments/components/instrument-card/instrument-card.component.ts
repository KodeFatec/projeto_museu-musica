import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Instrument } from '../../../../core/models/instrument.model';
import { dateRange } from '../../../../core/utils/date-format';

@Component({
  selector: 'app-instrument-card',
  standalone: false,
  template: `
    <article class="card">
      <div class="photo">
        @if (instrument().photoUrl) {
          <img [src]="instrument().photoUrl" [alt]="instrument().title" loading="lazy" />
        } @else {
          <span aria-hidden="true">♫</span>
        }
      </div>
      <div class="body">
        <p class="eyebrow">
          @if (instrument().type) { <span class="tag">{{ instrument().type }}</span> }
          <span>#ITEM-{{ instrument().id.toString().padStart(3, '0') }}</span>
        </p>
        <h2>{{ instrument().title }}</h2>
        @if (instrument().year || instrument().maker) {
          <p class="meta">{{ instrument().year ? 'Ano ' + instrument().year : '' }}{{ instrument().year && instrument().maker ? ' • ' : '' }}{{ instrument().maker }}</p>
        }
        @if (instrument().description) { <p class="description">{{ instrument().description }}</p> }
      </div>
      <div class="details">
        @if (instrument().condition) { <strong>{{ instrument().condition }}</strong> }
        @if (instrument().acquiredAt) { <span>Adquirido em {{ dateRange(instrument().acquiredAt!) }}</span> }
        @if (instrument().origin) { <span>Origem: {{ instrument().origin }}</span> }
        @if (instrument().formerOwner) { <span>Antigo dono: {{ instrument().formerOwner }}</span> }
      </div>
    </article>
  `,
  styles: `
    .card { display: grid; grid-template-columns: 7rem minmax(0, 1fr) 15rem; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid rgba(197,154,69,.25); border-radius: 1rem; background: #fffdf8; box-shadow: 0 4px 14px rgba(60,45,20,.07); }
    .photo { aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; border-radius: .75rem; background: linear-gradient(145deg, #2b241e, #1e1915); color: var(--gold-300); font-size: 2rem; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .eyebrow { display: flex; gap: .5rem; margin: 0 0 .35rem; font-size: .7rem; color: var(--muted); }
    .tag { padding: .15rem .5rem; border-radius: 4px; background: var(--gold-500); color: #1c1308; }
    h2 { margin: 0; font: 700 1.35rem/1.2 var(--font-title); color: var(--ink); }
    .meta, .description, .details { margin: .35rem 0 0; color: var(--muted); }
    .description { font-style: italic; }
    .details { display: grid; gap: .35rem; text-align: right; font-size: .78rem; }
    .details strong { justify-self: end; padding: .2rem .7rem; border-radius: 999px; background: #ece3d0; color: #6b5a2f; }
    @media (max-width: 800px) { .card { grid-template-columns: 5rem minmax(0, 1fr); } .details { grid-column: 1 / -1; text-align: left; } .details strong { justify-self: start; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentCardComponent {
  readonly instrument = input.required<Instrument>();
  protected readonly dateRange = dateRange;
}
