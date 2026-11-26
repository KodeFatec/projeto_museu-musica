import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { InstrumentMedia } from '../../../../core/models/instrument.model';

/** Mídias do item (`midia`): fotos em galeria, áudios e vídeos com player e documentos como link. */
@Component({
  selector: 'app-instrument-media',
  standalone: false,
  templateUrl: './instrument-media.component.html',
  styleUrl: './instrument-media.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentMediaComponent {
  readonly media = input.required<InstrumentMedia[]>();

  protected readonly images = computed(() => this.media().filter((m) => m.kind === 'image'));
  protected readonly audios = computed(() => this.media().filter((m) => m.kind === 'audio'));
  protected readonly videos = computed(() => this.media().filter((m) => m.kind === 'video'));
  protected readonly documents = computed(() => this.media().filter((m) => m.kind === 'document'));
}
