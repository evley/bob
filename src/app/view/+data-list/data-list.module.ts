import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DataListComponent } from './data-list.component';

@NgModule({
  declarations: [DataListComponent],
  imports: [CommonModule, MatListModule, MatIconModule, MatTooltipModule, ScrollingModule],
  exports: [DataListComponent],
  providers: []
})
export class DataListModule {}
