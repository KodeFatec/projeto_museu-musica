import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ViewTab {
  id: string;
  label: string;
  /** Path SVG (viewBox 24x24, traço). */
  icon: string;
}

/** Abas segmentadas (só aparecem no mobile). */
@Component({
  selector: 'app-view-tabs',
  standalone: false,
  templateUrl: './view-tabs.component.html',
  styleUrl: './view-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewTabsComponent {
  readonly tabs = input.required<ViewTab[]>();
  readonly active = input.required<string>();
  readonly tabChange = output<string>();
}
