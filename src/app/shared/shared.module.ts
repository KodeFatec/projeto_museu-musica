import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CassetteTapeComponent } from './cassette-tape/cassette-tape.component';
import { VinylDiscComponent } from './vinyl-disc/vinyl-disc.component';

/** Disco de vinil e fita K7: usados na biblioteca, no player e no mini player. */
@NgModule({
  declarations: [VinylDiscComponent, CassetteTapeComponent],
  imports: [CommonModule],
  exports: [VinylDiscComponent, CassetteTapeComponent],
})
export class SharedModule {}
