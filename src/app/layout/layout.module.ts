import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MenuComponent } from './menu/menu.component';
import { MiniPlayerComponent } from './mini-player/mini-player.component';

/** Elementos presentes em todas as telas: menu e mini player. */
@NgModule({
  declarations: [MenuComponent, MiniPlayerComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [MenuComponent, MiniPlayerComponent],
})
export class LayoutModule {}
