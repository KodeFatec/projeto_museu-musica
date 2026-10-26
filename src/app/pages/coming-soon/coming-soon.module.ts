import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComingSoonComponent } from './coming-soon.component';

@NgModule({
  declarations: [ComingSoonComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ComingSoonComponent }])],
})
export class ComingSoonModule {}
