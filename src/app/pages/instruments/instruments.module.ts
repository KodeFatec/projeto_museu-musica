import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InstrumentCardComponent } from './components/instrument-card/instrument-card.component';
import { InstrumentsComponent } from './instruments.component';

@NgModule({
  declarations: [InstrumentsComponent, InstrumentCardComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild([{ path: '', component: InstrumentsComponent }])],
})
export class InstrumentsModule {}
