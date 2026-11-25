import { ChangeDetectionStrategy, Component, input, OnDestroy, signal } from '@angular/core';
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
        <h2><a class="link" [routerLink]="['/instrumentos', instrument().id]">{{ instrument().title }}</a></h2>
        @if (instrument().year || instrument().maker) {
          <p class="meta">{{ instrument().year ? 'Ano ' + instrument().year : '' }}{{ instrument().year && instrument().maker ? ' • ' : '' }}{{ instrument().maker }}</p>
        }
        @if (instrument().description) { <p class="description">{{ instrument().description }}</p> }
      </div>
      <div class="details">
        @if (instrument().acquiredAt) { <span>Adquirido em {{ dateRange(instrument().acquiredAt!) }}</span> }
        @if (instrument().origin) { <span>Origem: {{ instrument().origin }}</span> }
        <button
          type="button"
          class="play"
          [disabled]="!instrument().audioUrl"
          [attr.aria-label]="playing() ? 'Pausar ' + instrument().title : 'Tocar ' + instrument().title"
          [attr.aria-pressed]="playing()"
          (click)="togglePlay()"
        >
          @if (playing()) {
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          }
        </button>
      </div>
    </article>
  `,
  styles: `
    .card { position: relative; display: grid; transition: box-shadow .2s, border-color .2s; grid-template-columns: 7rem minmax(0, 1fr) 15rem; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid rgba(197,154,69,.25); border-radius: 1rem; background: #fffdf8; box-shadow: 0 4px 14px rgba(60,45,20,.07); }
    .card:hover, .card:focus-within { border-color: var(--gold-500); box-shadow: 0 8px 22px rgba(60,45,20,.14); }
    .link { color: inherit; text-decoration: none; }
    .link::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
    .card:hover h2 .link { color: var(--gold-700); }
    .photo { aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; border-radius: .75rem; background: linear-gradient(145deg, #2b241e, #1e1915); color: var(--gold-300); font-size: 2rem; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .eyebrow { display: flex; gap: .5rem; margin: 0 0 .35rem; font-size: .7rem; color: var(--muted); }
    .tag { padding: .15rem .5rem; border-radius: 4px; background: var(--gold-500); color: #1c1308; }
    h2 { margin: 0; font: 700 1.35rem/1.2 var(--font-title); color: var(--ink); }
    .meta, .description, .details { margin: .35rem 0 0; color: var(--muted); }
    .description { font-style: italic; }
    .details { display: grid; gap: .35rem; text-align: right; font-size: .78rem; }
    .play { position: relative; z-index: 1; justify-self: end; width: 3rem; height: 3rem; display: grid; place-items: center; border: 0; border-radius: 50%; background: var(--gold-500); color: #1c1308; cursor: pointer; box-shadow: 0 4px 12px rgba(197,154,69,.25); }
    .play svg { width: 1.35rem; height: 1.35rem; }
    .play:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
    @media (max-width: 800px) { .card { grid-template-columns: 5rem minmax(0, 1fr); } .details { grid-column: 1 / -1; text-align: left; } .play { justify-self: start; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentCardComponent implements OnDestroy {
  readonly instrument = input.required<Instrument>();
  readonly playing = signal(false);
  protected readonly dateRange = dateRange;
  private audio?: HTMLAudioElement;

  togglePlay(): void {
    const audioUrl = this.instrument().audioUrl;
    if (!audioUrl) return;

    if (this.audio?.src !== new URL(audioUrl, globalThis.location?.href).href) {
      this.audio?.pause();
      this.audio = new Audio(audioUrl);
      this.audio.addEventListener('ended', () => this.playing.set(false));
      this.audio.addEventListener('error', () => this.playing.set(false));
    }

    if (this.playing()) {
      this.audio.pause();
      this.playing.set(false);
    } else {
      void this.audio.play().then(() => this.playing.set(true)).catch(() => this.playing.set(false));
    }
  }

  ngOnDestroy(): void {
    this.audio?.pause();
  }
}
