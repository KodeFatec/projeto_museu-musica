import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CassetteTapeComponent } from './cassette-tape/cassette-tape.component';
import { CdDiscComponent } from './cd-disc/cd-disc.component';
import { VinylDiscComponent } from './vinyl-disc/vinyl-disc.component';

/** Disco de vinil, CD e fita K7: usados na biblioteca, no player e no mini player. */
@NgModule({
  declarations: [VinylDiscComponent, CassetteTapeComponent, CdDiscComponent],
  imports: [CommonModule],
  exports: [VinylDiscComponent, CassetteTapeComponent, CdDiscComponent],
})
export class SharedModule {}
