import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TrackArtist } from '../../../../core/models/track.model';

/** Artistas e instrumentos da gravação: artista + musica_artista.tipo_participacao. */
@Component({
  selector: 'app-participants-list',
  standalone: false,
  templateUrl: './participants-list.component.html',
  styleUrl: './participants-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsListComponent {
  readonly artists = input.required<TrackArtist[]>();

  protected initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  }
}
