import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScoreSheet } from '../../../../core/models/track.model';

/** Partitura do acervo (partitura + item_acervo). As pautas são decorativas. */
@Component({
  selector: 'app-score-plate',
  standalone: false,
  templateUrl: './score-plate.component.html',
  styleUrl: './score-plate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScorePlateComponent {
  readonly score = input.required<ScoreSheet>();
}
