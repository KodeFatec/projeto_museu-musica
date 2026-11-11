import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CassetteTapeComponent } from './cassette-tape/cassette-tape.component';
import { CdDiscComponent } from './cd-disc/cd-disc.component';
import { SearchFieldComponent } from './search-field/search-field.component';
import { VinylDiscComponent } from './vinyl-disc/vinyl-disc.component';

/** Disco de vinil, CD, fita K7 e campo de busca: usados em várias telas. */
@NgModule({
  declarations: [VinylDiscComponent, CassetteTapeComponent, CdDiscComponent, SearchFieldComponent],
  imports: [CommonModule],
  exports: [VinylDiscComponent, CassetteTapeComponent, CdDiscComponent, SearchFieldComponent],
})
export class SharedModule {}
