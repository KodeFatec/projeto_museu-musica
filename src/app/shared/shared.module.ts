import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CassetteTapeComponent } from './cassette-tape/cassette-tape.component';
import { CdDiscComponent } from './cd-disc/cd-disc.component';
import { FilterChipsComponent } from './filter-chips/filter-chips.component';
import { MobileHeadComponent } from './mobile-head/mobile-head.component';
import { SearchFieldComponent } from './search-field/search-field.component';
import { VinylDiscComponent } from './vinyl-disc/vinyl-disc.component';

/** Disco de vinil, CD, fita K7, campo de busca, chips e cabeçalho mobile: usados em várias telas. */
@NgModule({
  declarations: [VinylDiscComponent, CassetteTapeComponent, CdDiscComponent, SearchFieldComponent, FilterChipsComponent, MobileHeadComponent],
  imports: [CommonModule, RouterModule],
  exports: [VinylDiscComponent, CassetteTapeComponent, CdDiscComponent, SearchFieldComponent, FilterChipsComponent, MobileHeadComponent],
})
export class SharedModule {}
