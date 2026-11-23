import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MuseumBannerComponent } from './museum-banner.component';

/** Faixa "Visite o museu": usada nas telas Início e Descobrir. */
@NgModule({
  declarations: [MuseumBannerComponent],
  imports: [CommonModule],
  exports: [MuseumBannerComponent],
})
export class MuseumBannerModule {}
